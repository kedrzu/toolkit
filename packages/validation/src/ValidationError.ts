import type { ValidationErrors } from './Validator.js';

export class ValidationError extends Error {
    public readonly errors: ValidationErrors;

    constructor(message: string);
    constructor(message: string, errors: ValidationErrors);
    constructor(errors: ValidationErrors);
    constructor(messageOrErrors: string | ValidationErrors, errors?: ValidationErrors) {
        let message: string;
        if (typeof messageOrErrors === 'string') {
            message = messageOrErrors;
        } else {
            message = 'Validation failed';
            errors = messageOrErrors;
        }

        super(message, { cause: errors });
        this.errors = errors || {};
    }
}
