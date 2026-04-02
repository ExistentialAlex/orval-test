/**
 * Converts a string to PascalCase by capitalizing the first character.
 *
 * @param {string} value Input string to convert.
 * @returns {string} Pascal-cased output string.
 */
export const pascalCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);
