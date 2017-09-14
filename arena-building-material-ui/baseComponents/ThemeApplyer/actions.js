import { ARENA_SCENE_SET_STATE } from "redux-arena/actionTypes";
import { LIGHT_THEME, DARK_THEME } from "../../constValues/theme";

export function applyLightTheme() {
  return {
    type: ARENA_SCENE_SET_STATE,
    state: {
      themeType: LIGHT_THEME
    }
  };
}

export function applyDarkTheme() {
  return {
    type: ARENA_SCENE_SET_STATE,
    state: {
      themeType: DARK_THEME
    }
  };
}
