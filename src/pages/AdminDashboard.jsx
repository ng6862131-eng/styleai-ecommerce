import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";
const TOKEN_KEY = "styleai-admin-token";

const emptyData = {
  summary: { users: 0, products: 0, carts: 0, orders: 0, sellers: 0 },
  users: [],
  products: [],
  carts: [],
  orders: [],
  sellers: [],
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(emptyData);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async (adminToken) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/admin/data`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const result = await response.json();
      if (response.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
        setError(result.message || "Please log in again.");
        return;
      }
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load store data.");
      }
      setData({ ...emptyData, ...result });
    } catch (loadError) {
      setError(loadError.message || "Unable to connect to the StyleAI backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData(token);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Admin login failed.");
      }
      sessionStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setPassword("");
      await loadData(result.token);
    } catch (loginError) {
      setError(loginError.message || "Unable to connect to the StyleAI backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/admin/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken("");
      setData(emptyData);
    }
  };

  if (!token) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <button className="admin-back-link" type="button" onClick={() => navigate("/")}>← Back to StyleAI</button>
          <span className="admin-eyebrow">STYLEAI STORE</span>
          <h1>Admin sign in</h1>
          <p>Sign in to view customers, products, carts, orders, and sellers.</p>
          <label htmlFor="admin-email">Admin email</label>
          <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          {error && <div className="admin-error" role="alert">{error}</div>}
          <button className="admin-primary-btn" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
      </main>
    );
  }

  const tabs = [
    ["users", "Users", data.summary.users],
    ["products", "Products", data.summary.products],
    ["carts", "Carts", data.summary.carts],
    ["orders", "Orders", data.summary.orders],
    ["sellers", "Sellers", data.summary.sellers],
  ];

  return (
    <main className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div><span className="admin-eyebrow">STYLEAI STORE</span><h1>Admin dashboard</h1></div>
        <div className="admin-header-actions">
          <button className="admin-secondary-btn" onClick={() => loadData(token)} disabled={loading}>{loading ? "Refreshing…" : "Refresh data"}</button>
          <button className="admin-logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {error && <div className="admin-error admin-page-error" role="alert">{error}</div>}

      <section className="admin-stat-grid" aria-label="Store totals">
        {tabs.map(([key, label, count]) => <button key={key} className={`admin-stat-card ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}><span>{label}</span><strong>{count}</strong></button>)}
      </section>

      <section className="admin-data-card">
        <div className="admin-data-heading"><div><span className="admin-eyebrow">STORE RECORDS</span><h2>{tabs.find(([key]) => key === activeTab)?.[1]}</h2></div><span>{loading ? "Loading records…" : "Data from MySQL"}</span></div>
        {activeTab === "users" && <div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Account ID</th><th>Created</th></tr></thead><tbody>{data.users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.id}</td><td>{formatDate(user.createdAt)}</td></tr>)}</tbody></table>{!data.users.length && <p className="admin-empty">No customer accounts are stored yet.</p>}</div>}
        {activeTab === "products" && <div className="admin-table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Gender</th><th>Price</th><th>Stock</th></tr></thead><tbody>{data.products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.category}</td><td>{product.gender || "—"}</td><td>₹{Number(product.price).toLocaleString("en-IN")}</td><td>{product.stock}</td></tr>)}</tbody></table>{!data.products.length && <p className="admin-empty">No products are stored yet.</p>}</div>}
        {activeTab === "carts" && <div className="admin-table-wrap"><table><thead><tr><th>Customer</th><th>Email</th><th>Items</th><th>Cart value</th><th>Last updated</th></tr></thead><tbody>{data.carts.map((cart) => { const quantity = cart.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0); const total = cart.items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0); return <tr key={cart.id}><td>{cart.user.name}</td><td>{cart.user.email}</td><td>{quantity}</td><td>₹{total.toLocaleString("en-IN")}</td><td>{formatDate(cart.updatedAt)}</td></tr>; })}</tbody></table>{!data.carts.length && <p className="admin-empty">No customer carts have synced yet.</p>}</div>}
        {activeTab === "orders" && <div className="admin-table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Status</th><th>Total</th><th>Date</th></tr></thead><tbody>{data.orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.customer?.name || "Customer"}<small>{order.customer?.email}</small></td><td><span className="admin-status-pill">{order.paymentStatus || "Paid"}</span></td><td>₹{Number(order.total || 0).toLocaleString("en-IN")}</td><td>{order.date || "—"}</td></tr>)}</tbody></table>{!data.orders.length && <p className="admin-empty">No orders have been placed yet.</p>}</div>}
        {activeTab === "sellers" && <div className="admin-table-wrap"><table><thead><tr><th>Seller</th><th>Email</th><th>Seller ID</th><th>Joined</th></tr></thead><tbody>{data.sellers.map((seller) => <tr key={seller.id}><td>{seller.name}</td><td>{seller.email}</td><td>{seller.id}</td><td>{formatDate(seller.createdAt)}</td></tr>)}</tbody></table>{!data.sellers.length && <p className="admin-empty">No sellers are registered yet.</p>}</div>}
      </section>
      <p className="admin-data-note">Customer passwords are protected and are never displayed here. Cart details appear after a customer signs in and the app syncs their cart.</p>
    </main>
  );
}

export default AdminDashboard;
