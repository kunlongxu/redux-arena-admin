import React, { Component } from "react";
import { Provider } from "react-redux";
import rootSaga from "./redux/saga";
import { createArenaStore } from "../redux-arena";
import frameState from "./redux/frameState.js";
import { withRouter } from "react-router-dom";
import Frame from "./Frame";
import thunk from "redux-thunk";
import { mergeModeRoute } from "./commons/commonFunc";
import { Router } from "react-router-dom";
import { connect } from "react-redux";
import createHistory from "history/createBrowserHistory";
import configureStore from "./configureStore";
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

const history = createHistory();
const store = configureStore(history);

export default class BarcsysFrame extends Component {
  componentWillMount() {
    document.getElementById("app").className = "fullHeight";
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Frame rootRoute={mergeModeRoute(this.props.rootRoute)} />
        </Router>
      </Provider>
    );
  }
}
