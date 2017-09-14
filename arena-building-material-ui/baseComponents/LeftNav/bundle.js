import LeftNav from "./LeftNav";

export default {
  Component: LeftNav,
  propsPicker: (state, actions, allState, { frame }) => ({
    isLeftNavOpen: allState[frame.reducerKey].isLeftNavOpen,
    isLeftNavDocked: allState[frame.reducerKey].isLeftNavDocked,
    frameActions: frame.actions
  })
};
