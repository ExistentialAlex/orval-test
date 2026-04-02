export const coerceSingleQueryParamToArray = (v: unknown) => {
  if (typeof v === 'string') {
    return [v];
  }
  return v;
};
