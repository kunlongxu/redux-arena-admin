import React, { Component } from "react";
import ReactDOM from "react-dom";
import BarcsysFrame from "barcsys-dashboard/BarcsysFrame";
import pageABundle from "./pageABundle"
import rootRoute from "./rootRoute.js"
ReactDOM.render(
  <BarcsysFrame rootRoute={rootRoute} />,
  document.getElementById("app")
);