export function toJson<T>(value: T, space?: string | number): string {
    if (value == null) {
        return 'null';
    }

    return JSON.stringify(
        value,
        (key, value: unknown) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }

            if (value instanceof Set) {
                const result: unknown[] = [];
                for (const val of value) {
                    result.push(val);
                }

                return result;
            }

            if (value instanceof Map) {
                const map = value as Map<string, unknown>;
                const result: Record<string, unknown> = {};
                for (const [key, val] of map.entries()) {
                    result[key] = val;
                }

                return result;
            }

            return value;
        },
        space,
    );
}
