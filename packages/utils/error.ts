import { isString } from "lodash-es";

class YeUIError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "YeUIError";
  }
}
function createErUIError(scope: string, msg: string) {
  return new YeUIError(`[${scope}]:${msg}`);
}

export function throwError(scope: string, msg: string) {
  throw createErUIError(scope, msg);
}

// 只有非生产环境生效
export function debugWarn(error: Error): void;
export function debugWarn(scope: string, msg: string): void;
export function debugWarn(scope: string | Error, msg?: string) {
  if (process.env.NODE_ENV !== "production") {
    const err = isString(scope) ? createErUIError(scope, msg!) : scope;
    console.warn(err);
  }
}