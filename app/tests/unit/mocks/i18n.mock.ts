/**
 * Recursively finds the value of a deep key in an object based on a period-delimited string.
 * @param keyString The period-delimited string representing the path to the value.
 * @param inputObject The object to search within.
 * @returns The value found at the specified deep key, or undefined if not found.
 */
const findDeepValue = (
  keyString: string,
  inputObject: any,
): string | undefined | ((v: any) => string) => {
  // Split the key string into an array of keys.
  const keys = keyString.split('.');

  // Initialize a variable to keep track of the current position in the object as we traverse it.
  let currentObject = inputObject;

  // Loop through each key in the array.
  for (const key of keys) {
    // If the current object is undefined or null, or does not have the key, return undefined.
    if (currentObject === undefined || currentObject === null || !(key in currentObject)) {
      return undefined;
    }
    // Move our reference to the next level in the object.
    currentObject = currentObject[key];
  }

  // After traversing all keys, return the final value.
  return currentObject;
};

export const mockI18n = (messages: any) => {
  return {
    useI18n: () => ({
      t: (input: string, options: Record<string, any>) => {
        const named = (key: string) => options[key];

        const value = findDeepValue(input, messages);

        if (typeof value === 'function') {
          return value({ named });
        }

        return value;
      },
    }),
  };
};
