import state from "./redux/initState";
import saga from "./redux/saga";
import LoginFrame from "./LoginFrame.jsx";
import * as actions from "./redux/actions";

export default {
  state,
  saga,
  Component: LoginFrame,
  actions
};
