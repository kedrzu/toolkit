import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
    './packages/ioc/vitest.config.ts',
    './packages/utils/vitest.config.ts',
    './packages/zchema/vitest.config.ts',
]);
