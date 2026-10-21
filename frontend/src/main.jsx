
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import { ProductProvider } from "./Context/ProductContext.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { AdminAuthProvider } from "./Context/AdminAuthContext.jsx";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
  <BrowserRouter>
    <AdminAuthProvider>
      <CartProvider>
        <ProductProvider>
          <ScrollToTop />
          <App />
        </ProductProvider>
      </CartProvider>
    </AdminAuthProvider>
  </BrowserRouter>
</React.StrictMode>
);
