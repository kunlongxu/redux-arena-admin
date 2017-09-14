export function map(menusData, lastTuple = [[], ""]) {
  return [lastTuple[0].concat(menusData.name), menusData.path];
}

export function reduce(prev, cur) {
  return Object.assign(prev, { [cur[1]]: cur[0] });
}

export const defaultValue = {};
