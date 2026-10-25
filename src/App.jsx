import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Order = lazy(() => import("./pages/Order"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Customize3D = lazy(() => import("./pages/Customize3D"));
const AiChatbot = lazy(() => import("./components/AiChatbot"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const SellerLogin = lazy(() => import("./pages/SellerLogin"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const SellerOrderDetails = lazy(() => import("./pages/SellerOrderDetails"));
const SellerOrders = lazy(() => import("./pages/SellerOrders"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div role="status">Loading page…</div>}>
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

        <Route path="/contact" element={<Contact />} />

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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;