// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css"; // light weight
import "@fontsource/roboto/400.css"; // regular weight
import "@fontsource/roboto/500.css"; // medium weight
import "@fontsource/roboto/700.css"; // bold weight

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
