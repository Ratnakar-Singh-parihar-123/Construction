// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./styles/tailwind.css";
// import "./styles/index.css";

// const container = document.getElementById("root");
// const root = createRoot(container);

// root.render(<App />);


import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import "./index.css"; // merge all css here
import "./styles/tailwind.css";
import "./styles/index.css";


const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in index.html");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
