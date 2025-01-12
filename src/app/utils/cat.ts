const cat__ = Function.prototype.apply.bind(Array.prototype.concat);
export const cat = <T = any>(...items: T[]) => cat__([], items);
