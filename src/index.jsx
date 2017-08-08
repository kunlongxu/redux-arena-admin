import React, { Component } from "react";
import ReactDOM from "react-dom";
import BarcsysFrame from "barcsys-dashboard/BarcsysFrame";
import PublicScene from "redux-arena/PublicScene";
import pageABundle from "./pageABundle"
ReactDOM.render(
  <BarcsysFrame>
    <PublicScene path="/pageA" sceneBundle={pageABundle} />
    {/* <PublicScene path="/asyncPageB" asyncSceneBundle={asyncPageB} />  */}
  </BarcsysFrame>,
  document.getElementById("app")
);