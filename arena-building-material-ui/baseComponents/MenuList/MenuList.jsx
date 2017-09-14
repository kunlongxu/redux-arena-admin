import React, { Component } from "react";
import { List, ListItem, makeSelectable } from "material-ui/List";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";

let SelectableList = makeSelectable(List);

export default class MenuList extends Component {
  componentWillMount() {
    this.props.actions.setState({ curPath: this.props.match.path });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match !== nextProps.match) {
      this.props.actions.setState({ curPath: nextProps.match.path });
    }
  }

  handleRequestChange = (event, path) => {
    this.props.actions.setState({ curPath: path });
    path && this.props.frameActions.goToUrl(path);
  };

  buildMenusFromData(menusData, selectedPath) {
    if (menusData == null) return;
    return menusData
      .map(item => {
        let selectedFlag = selectedPath.indexOf(item.path) === 0;
        let Icon = item.icon;
        if (item.hide === true) return null;
        if (item.subMenus != null) {
          return (
            <ListItem
              style={{ userSelect: "none" }}
              key={item.path}
              value={null}
              primaryText={item.name}
              leftIcon={<Icon />}
              primaryTogglesNestedList={true}
              nestedItems={this.buildMenusFromData(item.subMenus, selectedPath)}
              initiallyOpen={selectedFlag}
            />
          );
        } else {
          return (
            <ListItem
              style={{ userSelect: "none" }}
              key={item.path}
              value={item.path}
              primaryText={item.name}
              leftIcon={<Icon />}
            />
          );
        }
      })
      .filter(item => (item == null ? false : true));
  }

  render() {
    let { menusData, match, curPath } = this.props;
    if (menusData == null) return null;
    let menus = this.buildMenusFromData(menusData.subMenus, match.path);
    return (
      <SelectableList value={match.path} onChange={this.handleRequestChange}>
        {menus}
      </SelectableList>
    );
  }
}
