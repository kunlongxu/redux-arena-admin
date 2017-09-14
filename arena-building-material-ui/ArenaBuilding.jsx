import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { Frame, ThemeApplyer } from "./baseComponents";
import { login, oauthCallBack, notMatch } from "./routeComponents";

if (self === top) {
  console.log(
    "%c\
 ____ ___      .____________              __         .__\n\
|    |   \\____ |__\\______   \\____________/  |______  |  |\n\
|    |   /    \\|  ||     ___/  _ \\_  __ \\   __\\__  \\ |  |\n\
|    |  /   |  \\  ||    |  (  <_> )  | \\/|  |  / __ \\|  |__\n\
|______/|___|  /__||____|   \\____/|__|   |__| (____  /____/\n\
             \\/                                    \\/",
    "color:#66ccff"
  );

  console.log(
    "If you see some %cwarning%c in console, don't panic and keep using it as regular.\n\
Sadlly redux is not friendly to my magical operation :(",
    "color:red;font-size:16px;font-weight:800;border: 1px solid red;padding:0px 3px",
    "color:black"
  );

  console.log(
    "Contact author: %cwanglejia@gmail.com",
    "color:orange;font-size:16px"
  );
}

injectTapEventPlugin();

const history = createHistory();
const store = configureStore();

const preDefineRoutes = [login, oauthCallBack, notMatch];

export default class ArenaBuilding extends Component {
  static propTypes = {
    rootRoute: PropTypes.object
  };

  render() {
    return (
      <Provider store={store}>
        <ThemeApplyer>
          <Router history={history}>
            <Frame
              history={history}
              rootRoute={this.props.rootRoute}
              preDefineRoutes={preDefineRoutes}
            />
          </Router>
        </ThemeApplyer>
      </Provider>
    );
  }
}
