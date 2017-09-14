import ThemeApplyer from "./ThemeApplyer";
import state from "./state";
import actions from "./actions";

export default {
  Component: ThemeApplyer,
  state,
  actions,
  options: {
    vReducerKey: "theme"
  }
};
