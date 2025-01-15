#!/usr/bin/env node

import { execute, settings } from '@oclif/core';
import consola from 'consola';
import sourceMap from 'source-map-support';

consola.wrapAll();
sourceMap.install();

// In dev mode, always show stack traces
settings.debug = true;
settings.performanceEnabled = true;

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalEmit = process.emit;
process.emit = function (name, data, ...args) {
    if (name === `warning` && typeof data === `object`) {
        if (data.name === 'ExperimentalWarning') {
            return false;
        }

        if (data.name === 'DeprecationWarning' && data.message.includes('punycode')) {
            return false;
        }
    }

    return originalEmit.apply(process, arguments);
};

// Start the CLI
await execute({ dir: import.meta.url });
