import MenuList from "./MenuList";

export default {
  Component: MenuList,
  propsPicker: (state, actions, allState, { frame }) => ({
    curPath: state.curPath,
    actions,
    menusData: allState[frame.reducerKey].menusData,
    match: allState[frame.reducerKey].match,
    frameActions: frame.actions,
  })
};
