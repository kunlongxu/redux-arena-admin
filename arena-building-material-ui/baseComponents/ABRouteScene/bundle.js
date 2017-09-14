import ABRouteScene from "./ABRouteScene";
import state from "./state";

export default {
  Component: ABRouteScene,
  state,
  propsPicker: (state, actions, allState, { frame }) => ({
    isValid: state.isValid,
    actions,
    userInfo: allState[frame.reducerKey].userInfo,
    isLoadingUserInfo: allState[frame.reducerKey].isLoadingUserInfo,
    frameActions: frame.actions
  })
};
