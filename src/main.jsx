import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppErrorBoundary from "./shared/components/AppErrorBoundary.jsx";
import App from "./App.jsx";
import "./index.css";
import "./shared/components/AcademicPages.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary><BrowserRouter>
      <App />
    </BrowserRouter></AppErrorBoundary>
  </React.StrictMode>
);
