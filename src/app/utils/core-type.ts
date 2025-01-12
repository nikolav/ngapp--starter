const toString_ = Function.prototype.call.bind(Object.prototype.toString);
export const coreType = (node: any) => toString_(node);
