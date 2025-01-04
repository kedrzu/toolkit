import type { Validator } from '../Validator.js';

export type RegexValidatorOptions = {
    regex: RegExp;
    message: (params: { value: string }) => string;
};

export function regexValidator(
    options: RegexValidatorOptions,
): Validator<string | null | undefined> {
    const { regex, message } = options;

    return (value, ctx) => {
        if (value == null) {
            return;
        }

        if (regex.test(value)) {
            return;
        }

        return message({ ...ctx, value });
    };
}
