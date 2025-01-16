import type { FunctionParams } from '@nzyme/types';
import { createNamedFunction, identity } from '@nzyme/utils';

import type { SchemaAny, SchemaBase, SchemaOptions, SchemaProto, Infer } from './Schema.js';

type SchemaBaseValue<F extends SchemaBase> = Exclude<Infer<ReturnType<F>>, undefined | null>;

type SchemaOptionsFactory<
    F extends SchemaBase = SchemaBase,
    O extends SchemaOptions<SchemaBaseValue<F>> = SchemaOptions<SchemaBaseValue<F>>,
> = (...args: FunctionParams<F>) => O;

type SchemaProtoFactory<
    F extends SchemaBase = SchemaBase,
    O extends SchemaOptions<SchemaBaseValue<F>> = SchemaOptions<SchemaBaseValue<F>>,
> = (options: O) => SchemaProto<SchemaBaseValue<F>>;

type SchemaDefinition<
    F extends SchemaBase = SchemaBase,
    O extends SchemaOptions<SchemaBaseValue<F>> = SchemaOptions<SchemaBaseValue<F>>,
> = {
    options?: SchemaOptionsFactory<F, O>;
    proto: SchemaProtoFactory<F, O>;
    name: string;
};

export function defineSchema<
    F extends SchemaBase,
    O extends SchemaOptions<SchemaBaseValue<F>> = SchemaOptions<SchemaBaseValue<F>>,
>(definition: SchemaDefinition<F, O>) {
    const optionsFactory = (definition.options ?? identity) as SchemaOptionsFactory<F, O>;
    const protoFactory = definition.proto;
    const SchemaBase: SchemaBase = createNamedFunction(definition.name, (...args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const options = optionsFactory(...(args as FunctionParams<F>)) ?? ({} as O);

        const schema: SchemaAny = {
            ...options,
            nullable: options.nullable ?? false,
            optional: options.optional ?? false,
            validators: (options.validators ?? []) as SchemaAny['validators'],
            type: SchemaBase,
            proto: protoFactory(options) as SchemaAny['proto'],
        };

        return schema;
    });

    return SchemaBase as F;
}
