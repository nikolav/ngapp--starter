const owns_ = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
export const coreHasOwn = (node: any, key: any) => owns_(Object(node), key);
