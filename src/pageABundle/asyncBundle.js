import state from "./redux/initState";
import saga from "./redux/saga";
import reducer from "./redux/reducer";
import PageA from "./PageA.jsx";
import * as actions from "./redux/actions";

export default {
  state,
  reducer,
  saga,
  Component: PageA,
  actions
};
