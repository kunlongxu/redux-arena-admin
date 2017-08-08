import React, { Component } from "react";
import { List, ListItem, makeSelectable } from "material-ui/List";
import CircularProgress from "material-ui/CircularProgress";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import { auth } from "appconfig/settings";
import { calcBreadcrumb } from "./commons/commonFunc";

let SelectableList = makeSelectable(List);

export default class MenusList extends Component {
  constructor(props) {
    super(props);
    this.state = { curPath: null, status: 1, icons: {} };
    this.handleRequestChange = (event, path) => {
      this.props.setBreadcrumb(calcBreadcrumb(this.props.menusData, path));
      this.setState({
        curPath: path
      });
      this.props.jumpTo(path);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match !== nextProps.match) {
      this.state.status = 1;
    }
    if (this.props.rootRoute !== nextProps.rootRoute)
      this.parseRootIcons(nextProps.rootRoute);
  }

  parseRootIcons(rootRoute) {
    if (rootRoute == null) return;
    if (rootRoute.icon != null) {
      this.state.icons[rootRoute.icon.displayName] = rootRoute.icon;
    }
    if (rootRoute.childRoutes != null)
      rootRoute.childRoutes.forEach(item => this.parseRootIcons(item));
  }

  componentWillMount() {
    this.parseRootIcons(this.props.rootRoute);
    this.props.setBreadcrumb(
      calcBreadcrumb(this.props.menusData, this.props.match.path)
    );
  }

  componentDidUpdate() {
    this.props.setBreadcrumb(
      calcBreadcrumb(this.props.menusData, this.props.match.path)
    );
  }

  buildMenusFromData(menusData, selectedPath, path) {
    if (menusData == null) return;
    return menusData
      .map(item => {
        let curPath = path + "/" + item.path;
        let selectedFlag = this.props.match.path.indexOf(curPath) === 0;
        let Icon = auth.type === "guardian"
          ? this.state.icons[item.icon]
          : item.icon;
        if (Icon == null) {
          console.error(
            `Icon: [${item.icon}] in path '${curPath}' is not defined`
          );
          Icon = NavigationMenu;
        }
        if (item.hide === true) return null;
        if (item.childRoutes != null) {
          return (
            <ListItem
              style={{ userSelect: "none" }}
              key={curPath}
              value={curPath}
              primaryText={item.name}
              leftIcon={<Icon />}
              primaryTogglesNestedList={true}
              nestedItems={this.buildMenusFromData(
                item.childRoutes,
                selectedPath,
                curPath
              )}
              initiallyOpen={selectedFlag}
            />
          );
        } else {
          return (
            <ListItem
              style={{ userSelect: "none" }}
              key={curPath}
              value={curPath}
              primaryText={item.name}
              leftIcon={<Icon />}
            />
          );
        }
      })
      .filter(item => (item == null ? false : true));
  }

  render() {
    let { menusData } = this.props;
    if (this.props.isLoadingMenu === true) {
      return <CircularProgress style={{ padding: "6rem" }} />;
    }
    if (menusData == null) return null;
    let Menus = this.buildMenusFromData(
      menusData.childRoutes,
      this.props.match.path,
      "/" + menusData.path
    );
    if (this.state.status === 1) {
      this.state.curPath = this.props.match.path;
      this.state.status = 0;
    }
    return (
      <SelectableList
        value={this.state.curPath}
        onChange={this.handleRequestChange}
      >
        {Menus}
      </SelectableList>
    );
  }
}
