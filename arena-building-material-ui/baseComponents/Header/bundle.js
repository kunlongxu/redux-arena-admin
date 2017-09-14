import Header from "./Header";

export default {
  Component: Header,
  propsPicker: (state, actions, allState, { frame, theme }) => ({
    match: allState[frame.reducerKey].match,
    breadcrumbDict: allState[frame.reducerKey].breadcrumbDict,
    isLeftNavDocked: allState[frame.reducerKey].isLeftNavDocked,
    isLeftNavOpen: allState[frame.reducerKey].isLeftNavOpen,
    userInfo: allState[frame.reducerKey].userInfo,
    frameActions: frame.actions,
    themeType: allState[theme.reducerKey].themeType,
    themeActions: theme.actions
  })
};
