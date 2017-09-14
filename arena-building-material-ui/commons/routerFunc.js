import React from "react";
import { matchPath } from "react-router-dom";

export function isRoutable(children, url) {
  let match;
  React.Children.forEach(children, element => {
    const { path: pathProp, exact, strict, sensitive, from } = element.props;
    const path = pathProp || from;

    if (match == null) {
      match = matchPath(url, { path, exact, strict, sensitive });
    }
  });
  return match != null;
}

export function calcAbsolutePath(parentPath, curPath) {
  if (curPath == null) return null;
  let absolutePath;
  if (curPath[0] === "/") {
    absolutePath = curPath;
  } else {
    if (parentPath === "/" || parentPath == null) {
      absolutePath = "/" + curPath.trim();
    } else {
      absolutePath = parentPath + "/" + curPath.trim();
    }
  }
  return absolutePath;
}
