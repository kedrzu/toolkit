/**
 * Create a code snippet.
 * @param code - Code to be displayed.
 * @param language - Language of the code.
 * @returns Code snippet.
 */
export function codeSnippet(code: string, language: string = '') {
    return `\`\`\`${language}\n${code}\n\`\`\``;
}
