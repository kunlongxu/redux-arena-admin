function _parseRouteConfig(rootRoute, lastTuples, buildFunctions) {
  if (rootRoute == null) return [];
  let curTuples = buildFunctions.map((buildFunc, index) =>
    buildFunc.map(rootRoute, lastTuples[index])
  );
  let curTupleArrays = curTuples.map(tuple => new Array(tuple));
  if (rootRoute.childRoutes != null) {
    curTupleArrays = rootRoute.childRoutes
      .map((childRoote, index) =>
        _parseRouteConfig(childRoote, curTuples, buildFunctions)
      )
      .reduce(
        (prev, cur) =>
          prev.map((tupleArray, index) => tupleArray.concat(cur[index])),
        curTupleArrays
      );
  }
  return curTupleArrays;
}

export default function parseRouteConfig(rootRoute, buildFunctions) {
  return _parseRouteConfig(
    rootRoute,
    [],
    buildFunctions
  ).map((tupleArray, index) =>
    tupleArray.reduce(
      (prev, cur) => buildFunctions[index].reduce(prev, cur),
      buildFunctions[index].defaultValue
    )
  );
}
