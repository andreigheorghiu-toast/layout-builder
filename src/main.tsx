import "brace";
import "brace/mode/json";
import "brace/theme/github";
import "brace/theme/tomorrow_night_eighties";
import "jsoneditor-react/es/editor.min.css";
import "react-dropdown/style.css";
import "./index.css";

import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { configure } from "mobx";
import React from "react";
import ReactDOM from "react-dom";

import { patchScrollBlockingListeners } from "@/util";

import App from "./App";

gsap.registerPlugin(ScrollToPlugin);

patchScrollBlockingListeners();

configure({
  enforceActions: "never",
});

ReactDOM.render(<App />, document.getElementById("root"));
