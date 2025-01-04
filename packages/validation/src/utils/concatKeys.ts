export function concatKeys(
    first: string | number | null | undefined,
    second: string | null | undefined | number,
): string {
    if (second == null || second === '') {
        return String(first);
    }

    if (first == null || first === '') {
        return String(second);
    }

    return `${first}.${second}`;
}
