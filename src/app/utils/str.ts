export const strEnsureHasPrefix = (value: string, prefix: string) => {
  return value.startsWith(prefix) ? value : `${prefix}${value}`;
};
