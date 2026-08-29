import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* SHOP */}
        <Route
          path="/shop"
          element={<Shop />}
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
         path="/register"
         element={<Register />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;