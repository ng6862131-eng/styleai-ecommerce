import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />
         <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
        <Route
  path="/cart"
  element={<Cart />}
/>


      </Routes>

    </BrowserRouter>
  );
}

export default App;