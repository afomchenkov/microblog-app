import React from "react";
import ReactDOM from "react-dom/client";
import { greet } from "@microblog/shared";

function App() {
  return <h1>{greet("from web")}</h1>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
