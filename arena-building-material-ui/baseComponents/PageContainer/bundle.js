import { FULLSCREEN } from "../../constValues/displayMode";
import PageContainer from "./PageContainer";
import * as actions from "./actions";
import saga from "./saga";
import state from "./state";

export default {
  Component: PageContainer,
  state,
  saga,
  actions,
  propsPicker: (state, actions, allState, { frame }) => ({
    snackbarInfo: state.snackbarInfo,
    rightDrawer: state.rightDrawer,
    isRightDrawerOpen: state.isRightDrawerOpen,
    actions,
    displayMode: allState[frame.reducerKey].displayMode,
    isLeftNavOpen: allState[frame.reducerKey].isLeftNavOpen,
    isLeftNavDocked: allState[frame.reducerKey].isLeftNavDocked
  }),
  options: {
    vReducerKey: "pageContainer"
  }
};
