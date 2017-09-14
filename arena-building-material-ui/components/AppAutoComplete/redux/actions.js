import { FRAME_LOAD_USERAPPDATA } from "barcsys-dashboard/redux/actionTypes";

export function loadUserAppData() {
  return {
    type: FRAME_LOAD_USERAPPDATA
  };
}
