import { calcAbsolutePath } from "../../../commons/routerFunc";
import { NOMAL_PAGE } from "../../../constValues/displayMode";

export function map(rootRoute, lastTuple = [""]) {
  let curPath = calcAbsolutePath(lastTuple[0], rootRoute.path);
  return [curPath, rootRoute.displayMode || NOMAL_PAGE];
}

export function reduce(prev, cur) {
  return Object.assign(prev, { [cur[0]]: cur[1] });
}

export const defaultValue = {};
