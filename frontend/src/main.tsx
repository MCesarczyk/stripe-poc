import React from "react";
import ReactDOM from "react-dom/client";
import { Normalize } from "styled-normalize";

import App from "./App.tsx";
import { GlobalStyle } from "./GlobalStyle.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Normalize />
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
