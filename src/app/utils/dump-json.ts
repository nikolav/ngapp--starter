export const dumpJson = (node: any) => {
  try {
    return JSON.stringify(node, null, 2);
  } catch (error) {
    // pass
  }
  return node;
};
