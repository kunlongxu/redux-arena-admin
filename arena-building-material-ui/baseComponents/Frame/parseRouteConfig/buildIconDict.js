import { calcAbsolutePath } from "../../../commons/routerFunc";

export function map(rootRoute, lastTuple = [""]) {
  let curPath = calcAbsolutePath(lastTuple[0], rootRoute.path);
  return [curPath, rootRoute.icon];
}

export function reduce(prev, cur) {
  return Object.assign(prev, { [cur[0]]: cur[1] });
}

export const defaultValue = {};
