import { LIGHT_THEME } from "../../constValues/theme";

export default { themeType: localStorage.getItem("themeType") || LIGHT_THEME };
