import state from "./redux/initState";
import saga from "./redux/saga";
import reducer from "./redux/reducer";
import PageB from "./PageB.jsx";
import * as actions from "./redux/actions";

export default {
  state,
  reducer,
  saga,
  Component: PageB,
  actions,
  mapStateToProps: (state, key) => ({
    pageA: state[key].pageA,
    name: state[key].name,
    dynamicState: state[key].dynamicState,
    cnt: state[key].cnt
  })
};
