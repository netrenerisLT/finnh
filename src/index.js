import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./Header.js";
import Search from "./Search.js";
import Footer from "./Footer.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Navbar />
    <Search />
    <Footer />
  </React.StrictMode>
);
