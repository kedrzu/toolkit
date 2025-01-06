import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Package } from '@lerna/package';
import { getPackages } from '@lerna/project';
import * as json from 'comment-json';
import fsExtra from 'fs-extra/esm';
import merge from 'lodash.merge';
import prettier from 'prettier';
import { Text } from 'ink';
import React, { useEffect, useState } from 'react';

interface TsConfig {
    path: string;
    config: Record<string, any>;
    resolved: Record<string, any>;
}

const tsConfigsCache = new Map<string, TsConfig | null>();

export default function Monorepo() {
    const [done, setDone] = useState(false);

    useEffect(() => {
        processProject().then(() => setDone(true));
    }, []);

    if (!done) {
        return <Text>Processing...</Text>;
    }

    return <Text>Done!</Text>;
}

async function processProject() {
    const cwd = process.cwd();
    const packages = await getPackages(cwd);

    const tsconfigPath = path.join(cwd, './tsconfig.dev.json');
    const references = await getTsReferences({
        path: tsconfigPath,
        dependencies: packages,
    });

    await saveTsReferences(tsconfigPath, references);

    await Promise.all(
        packages.map(pkg =>
            processPackage({
                pkg,
                packages,
            }),
        ),
    );
}

async function processPackage(params: { pkg: Package; packages: Package[] }) {
    const tsconfig = await loadTsConfigForPackage(params.pkg);
    if (!tsconfig) {
        return;
    }

    const dependencyNames = [
        ...Object.keys(params.pkg.dependencies || {}),
        ...Object.keys(params.pkg.devDependencies || {}),
    ];

    const dependencies = dependencyNames
        .map(d => params.packages.find(p => p.name === d)!)
        .filter(Boolean);

    const references = await getTsReferences({
        path: tsconfig.path,
        dependencies: dependencies,
    });

    const configPath = path.join(params.pkg.location, 'tsconfig.dev.json');
    await saveTsReferences(configPath, references);
}

async function getTsReferences(params: { path: string; dependencies: Package[] }) {
    const references: { path: string }[] = [];

    for (const dep of params.dependencies) {
        const depTsConfig = await loadTsConfigForPackage(dep);

        const disable =
            !depTsConfig ||
            !depTsConfig.resolved.compilerOptions ||
            !depTsConfig.resolved.compilerOptions.composite ||
            depTsConfig.resolved.compilerOptions.noEmit ||
            !(dep.get('main') || dep.get('exports') || dep.get('bin'));

        if (disable) {
            continue;
        }

        let relativePath = path.relative(path.dirname(params.path), depTsConfig.path);
        if (path.sep === '\\') {
            relativePath = relativePath.replace(/\\/g, '/');
        }

        if (!relativePath.startsWith('./') && !relativePath.startsWith('../')) {
            relativePath = './' + relativePath;
        }

        if (relativePath.endsWith('tsconfig.json')) {
            relativePath = relativePath.slice(0, -13) + 'tsconfig.dev.json';
        }

        references.push({
            path: relativePath,
        });
    }

    return references;
}

async function loadTsConfigForPackage(pkg: Package) {
    const filePath = path.join(pkg.location, 'tsconfig.json');
    return await loadTsConfig(filePath);
}

async function loadTsConfig(filePath: string) {
    let tsConfig = tsConfigsCache.get(filePath);
    if (!tsConfig) {
        tsConfig = await loadTsConfigCore(filePath);
        tsConfigsCache.set(filePath, tsConfig);
    }

    return tsConfig;
}

async function loadTsConfigCore(filePath: string) {
    if (!(await fsExtra.pathExists(filePath))) {
        return null;
    }

    let configFile = await fs.readFile(filePath, { encoding: 'utf8' });
    let configPath = filePath;

    const config = json.parse(configFile) as Record<string, any>;
    let resolved = json.parse(configFile) as Record<string, any>;

    while (resolved.extends) {
        configPath = resolveTsConfigPath(path.dirname(configPath), resolved.extends);
        configFile = await fs.readFile(configPath, { encoding: 'utf8' });

        const extendedConfig = json.parse(configFile) as Record<string, any>;

        delete resolved.extends;

        resolved = merge(extendedConfig, resolved);
    }

    const result: TsConfig = {
        path: filePath,
        config,
        resolved,
    };

    return result;
}

function resolveTsConfigPath(cwd: string, filePath: string) {
    if (filePath.startsWith('.')) {
        return path.resolve(cwd, filePath);
    }

    return fileURLToPath(import.meta.resolve(filePath));
}

async function saveTsReferences(configPath: string, references: { path: string }[]) {
    const config = {
        extends: './tsconfig.json',
        references,
    };

    let configJson = json.stringify(config, undefined, 2);

    const prettierConfig = await prettier.resolveConfig(configPath);
    configJson = await prettier.format(configJson, {
        ...prettierConfig,
        parser: 'json',
    });

    console.log(configPath);
    await fs.writeFile(configPath, configJson, { encoding: 'utf8' });
}
