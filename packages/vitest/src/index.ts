export * from './matchers/nullable.js';
export * from './matchers/nullish.js';
export * from './matchers/optional.js';

export * from './utils/advanceTime.js';

interface CustomMatchers<T = unknown> {
    toEqualFully: (expected: T) => void;
    toEqualPartially: <E>(expected: E) => void;
}

declare module 'vitest' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
    interface Assertion<T = any> extends CustomMatchers<T> {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface AsymmetricMatchersContaining extends CustomMatchers {}
}
