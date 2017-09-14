import { calcAbsolutePath } from "../../commons/routerFunc";
import ActionAssignment from "material-ui/svg-icons/action/assignment";

export function transFromGuardianMenu(guardianData, parentPath, iconDict) {
  if (guardianData == null) return null;
  return guardianData.map(item => {
    let curPath = calcAbsolutePath(parentPath, item.url);
    let menu = {
      name: item.name,
      icon: iconDict[curPath] || ActionAssignment,
      path: curPath
    };
    menu.subMenus = transFromGuardianMenu(
      item.subMenus,
      curPath,
      iconDict
    );
    return menu;
  });
}

export function transFromRouteConfig(rootRoute, parentPath) {
  let curPath = calcAbsolutePath(parentPath, item.url);
  let menu;
  if (rootRoute.hide != true) {
    menu = {
      name: item.name,
      icon: rootRoute.icon || ActionAssignment,
      path: curPath
    };
    if (rootRoute.childRoute) {
      menu.subMenus = rootRoute.childRoute.map(childRoute =>
        transFromRouteConfig(childRoute, curPath)
      );
    }
  }
  return menu;
}
