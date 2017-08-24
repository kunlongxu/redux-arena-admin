import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createArenaStore } from "../redux-arena";
import saga from "./redux/saga";
import frameReducer from "./redux/frameReducer.js";
import { initialState } from "./redux/frameReducer.js";

const enhancers = [applyMiddleware(thunk)];

export default function configureStore(history) {
  const store = createArenaStore(
    { frame: frameReducer },
    { frame: Object.assign({}, initialState, { history }) },
    saga,
    enhancers
  );
  return store;
}
