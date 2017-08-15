import state from "./redux/initState";
import saga from "./redux/saga";
import OAuthCallBack from "./OAuthCallBack.jsx"


export default {
  state,
  saga,
  Component: OAuthCallBack
}