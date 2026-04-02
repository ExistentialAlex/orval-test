export const truthy
  = () =>
    <T>(v: T) =>
      !!v;

export const defined
  = () =>
    <T>(v: T) =>
      v !== null && v !== undefined;

export const max
  = (max: number) =>
    <T extends { length: number }>(v: T): boolean =>
      v.length <= max;

export const min
  = (min: number) =>
    <T extends { length: number }>(v: T): boolean =>
      v.length >= min;

export const regex
  = (regex: RegExp) =>
    <T extends string>(v: T) =>
      new RegExp(regex).test(v);
