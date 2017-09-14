import React from "react";
import ReactDOM from "react-dom";
import { ArenaBuilding } from "arena-building-material-ui";
import rootRoute from "./rootRoute";

const rootEl = document.getElementById("app");

ReactDOM.render(<ArenaBuilding rootRoute={rootRoute} />, rootEl, function() {
  document.getElementById("app").className = "";
});
