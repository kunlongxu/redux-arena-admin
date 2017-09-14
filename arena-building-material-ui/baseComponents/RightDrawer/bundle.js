import RightDrawer from "./RightDrawer";

export default {
  Component: RightDrawer,
  propsPicker: (state, actions, allState, { pageContainer }) => ({
    isRightDrawerOpen: allState[pageContainer.reducerKey].isRightDrawerOpen,
    pageHeight: allState[pageContainer.reducerKey].pageHeight,
    pcActions: pageContainer.actions
  })
};
