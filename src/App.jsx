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
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import Wishlist from "./pages/Wishlist";
import Customize3D from "./pages/Customize3D";
import AiChatbot from "./components/AiChatbot";
import About from "./pages/About";
import SellerLogin from "./pages/SellerLogin";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOrderDetails from "./pages/SellerOrderDetails";
import SellerOrders from "./pages/SellerOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= SHOP ================= */}
        <Route
          path="/shop"
          element={<Shop />}
        />

        {/* ================= PRODUCT DETAILS ================= */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* ================= CART ================= */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= REGISTER ================= */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= CHECKOUT ================= */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* ================= ORDERS ================= */}
        <Route
          path="/orders"
          element={<Order />}
        />

        {/* ================= WISHLIST ================= */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* ================= AI STYLIST ================= */}
        <Route
          path="/ai"
          element={<AiChatbot />}
        />

        {/* ================= 3D CUSTOMIZER ================= */}
        <Route
          path="/customize/:id"
          element={<Customize3D />}
        />
        <Route
        path="/about"
        element={<About />}
        />

        {/* ================= SELLER LOGIN ================= */}
        <Route
          path="/seller/login"
          element={<SellerLogin />}
        />

        {/* ================= SELLER DASHBOARD ================= */}
        <Route
          path="/seller/dashboard"
          element={<SellerDashboard />}
        />
        {/* ================= SELLER ORDER DETAILS ================= */}
        <Route
          path="/seller/orders/:orderId"
          element={<SellerOrderDetails />}
        />
        {/* ================= SELLER ORDERS ================= */}
          <Route
            path="/seller/orders"
            element={<SellerOrders />}
          />

      </Routes>
    </BrowserRouter>
  );
}

export default App;