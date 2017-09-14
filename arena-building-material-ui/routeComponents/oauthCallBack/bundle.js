import OAuthCallBack from "./OAuthCallBack";

export default {
  Component: OAuthCallBack,
  propsPicker: (state, actions, allState, { routerSwitch }) => ({
    location: allState[routerSwitch.reducerKey].location
  })
};
