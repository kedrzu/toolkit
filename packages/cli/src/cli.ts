#!/usr/bin/env node

import { execute, settings } from '@oclif/core';
import { consola } from 'consola';
import sourceMap from 'source-map-support';

import { patchNodeWarnings } from '@nzyme/node-utils';

consola.wrapAll();
sourceMap.install();
patchNodeWarnings();

// In dev mode, always show stack traces
settings.debug = true;
settings.performanceEnabled = true;

// Start the CLI
await execute({ dir: import.meta.url });
