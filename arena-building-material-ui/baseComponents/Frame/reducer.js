import initialState from "./state";
import { ARENABUILDING_WINDOW_RESIZE } from "../../actionTypes";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ARENABUILDING_WINDOW_RESIZE:
      return Object.assign({}, state, {
        isLeftNavDocked: action.innerWidth >= 1440
      });
    default:
      return state;
  }
}
