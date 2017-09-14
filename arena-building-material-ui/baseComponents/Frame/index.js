import { withRouter } from "react-router-dom";
import { bundleToComponent } from "redux-arena/helper";
import bundle from "./bundle";

export default withRouter(bundleToComponent(bundle));
