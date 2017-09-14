function _parseMenusData(menusData, lastTuples, buildFunctions) {
  if (menusData == null) return [];
  let curTuples = buildFunctions.map((buildFunc, index) =>
    buildFunc.map(menusData, lastTuples[index])
  );
  let curTupleArrays = curTuples.map(tuple => new Array(tuple));
  if (menusData.subMenus != null) {
    curTupleArrays = menusData.subMenus
      .map((childRoote, index) =>
        _parseMenusData(childRoote, curTuples, buildFunctions)
      )
      .reduce(
        (prev, cur) =>
          prev.map((tupleArray, index) => tupleArray.concat(cur[index])),
        curTupleArrays
      );
  }
  return curTupleArrays;
}

export default function parseMenusData(menusData, buildFunctions) {
  return _parseMenusData(
    menusData,
    [],
    buildFunctions
  ).map((tupleArray, index) =>
    tupleArray.reduce(
      (prev, cur) => buildFunctions[index].reduce(prev, cur),
      buildFunctions[index].defaultValue
    )
  );
}
