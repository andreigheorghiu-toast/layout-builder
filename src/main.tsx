import React from "react";
import ReactDOM from "react-dom";

import "brace";
import "brace/mode/json";
import "brace/theme/github";
import "brace/theme/tomorrow_night_eighties";
import "jsoneditor-react/es/editor.min.css";
import "react-dropdown/style.css";

import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import "./index.css";
import App from "./App";

import { configure } from "mobx";
import { patchScrollBlockingListeners } from "@/util";

gsap.registerPlugin(ScrollToPlugin);

patchScrollBlockingListeners();

configure({
  enforceActions: "never",
});

ReactDOM.render(<App />, document.getElementById("root"));
