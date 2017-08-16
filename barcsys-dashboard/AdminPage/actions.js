import { FRAME_VALIDATE_USER } from "../redux/actionTypes";

export function validateUser(cb) {

  return {
    type: FRAME_VALIDATE_USER,
    cb
  };
}
