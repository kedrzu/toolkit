import type { Schema, SchemaBase } from '../Schema.js';

export function isSchema<V = unknown>(value: unknown): value is Schema<V>;
export function isSchema<F extends SchemaBase>(value: unknown, factory: F): value is ReturnType<F>;
export function isSchema(value: unknown, factory?: SchemaBase) {
    if (isSchemaBase(value)) {
        if (factory == null) {
            return true;
        }

        return value.type === factory;
    }

    return false;
}

function isSchemaBase(value: unknown): value is Schema {
    return value != null && typeof value === 'object' && 'proto' in value;
}
