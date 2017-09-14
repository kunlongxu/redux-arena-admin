import React, { Component } from "react";
import ActionHome from "material-ui/svg-icons/action/home";

const asyncBundle = import("./bundle");

export default {
  name: "主页",
  icon: ActionHome,
  path: "home",
  asyncBundle
};
