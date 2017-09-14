import Frame from "./Frame";
import * as actions from "./actions";
import state from "./state";
import saga from "./saga";
import reducer from "./reducer";

export default {
  Component: Frame,
  actions,
  state,
  saga,
  reducer,
  propsPicker: (state, actions) => ({
    actions,
    displayModeDict: state.displayModeDict,
    match: state.match,
    routeComs: state.routeComs,
    pageLoadingInfo: state.pageLoadingInfo
  }),
  options: {
    vReducerKey: "frame"
  }
};
