import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ServerError from "../components/ServerError";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try { const r = await api.get("/cart"); setCart(r.data); setError(""); }
    catch (err) { setCart([]); if (!err.response) setError("Cannot connect to server. Please make sure the backend is running."); }
  };
  useEffect(() => { fetchCart(); }, []);

  const flash = (text, type = "success") => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 2500);
  };

  const updateQty = async (id, quantity) => {
    try { await api.put(`/cart/${id}`, { quantity }); fetchCart(); }
    catch (err) { flash(err.response?.data?.message || "Error updating quantity", "error"); }
  };

  const remove = async (id) => {
    try { await api.delete(`/cart/${id}`); fetchCart(); }
    catch (err) { flash(err.response?.data?.message || "Error removing item", "error"); }
  };

  const clearCart = async () => {
    try { await api.delete("/cart/clear"); fetchCart(); }
    catch (err) { flash(err.response?.data?.message || "Error clearing cart", "error"); }
  };

  const placeOrder = async () => {
    if (!address.trim()) return flash("Please enter a shipping address", "error");
    setPlacing(true);
    try {
      await api.post("/orders/place", { shippingAddress: address });
      flash("Order placed successfully!");
      setAddress(""); fetchCart();
      setTimeout(() => navigate("/orders"), 1800);
    } catch (err) {
      flash(err.response?.data?.message || "Error placing order", "error");
    } finally { setPlacing(false); }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div style={s.page}>
      {msg && (
        <div style={{ ...s.toast, background: msgType === "success" ? "var(--success)" : "var(--danger)" }}>
          {msgType === "success" ? "✓ " : "✕ "}{msg}
        </div>
      )}

      <div style={s.container}>
        <div style={s.pageHeader}>
          <h2 style={s.title}>Shopping Cart</h2>
          {cart.length > 0 && (
            <span style={s.itemCount}>{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {error && <ServerError message={error} />}

        {!error && cart.length === 0 ? (
          <div style={s.emptyBox}>
            <div style={s.emptyIconWrap}>🛒</div>
            <h3 style={s.emptyTitle}>Your cart is empty</h3>
            <p style={s.emptySub}>Looks like you haven't added anything yet.</p>
            <button style={s.shopBtn} onClick={() => navigate("/")}>Browse Products</button>
          </div>
        ) : !error && (
          <div style={s.layout}>
            {/* Items */}
            <div style={s.itemsPanel}>
              <div style={s.itemsPanelHeader}>
                <span style={s.panelTitle}>Items</span>
                <button style={s.clearBtn} onClick={clearCart}>Clear all</button>
              </div>
              {cart.map((item) => (
                <div key={item.id} style={s.row}>
                  <img
                    src={item.product.imageUrl || "https://via.placeholder.com/80"}
                    alt={item.product.name}
                    style={s.img}
                  />
                  <div style={s.info}>
                    <p style={s.itemName}>{item.product.name}</p>
                    <p style={s.unitPrice}>Rs. {item.product.price.toLocaleString()} each</p>
                  </div>
                  <div style={s.qtyControl}>
                    <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span style={s.qty}>{item.quantity}</span>
                    <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <p style={s.subtotal}>Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                  <button style={s.removeBtn} onClick={() => remove(item.id)} title="Remove">✕</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={s.summary}>
              <h3 style={s.summaryTitle}>Order Summary</h3>
              <div style={s.summaryRows}>
                <div style={s.summaryRow}>
                  <span>Subtotal ({cart.length} items)</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                <div style={s.summaryRow}>
                  <span>Shipping</span>
                  <span style={{ color: "var(--success)", fontWeight: "600" }}>Free</span>
                </div>
              </div>
              <div style={s.divider} />
              <div style={s.totalRow}>
                <span>Total</span>
                <span style={s.totalAmount}>Rs. {total.toLocaleString()}</span>
              </div>

              <div style={s.addressSection}>
                <label style={s.addressLabel}>Shipping Address</label>
                <textarea
                  style={s.addressInput}
                  placeholder="Enter your full shipping address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <button
                style={{ ...s.orderBtn, ...(placing ? s.orderBtnLoading : {}) }}
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? "Placing Order..." : "Place Order →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: "var(--gray-1)", minHeight: "100vh", padding: "36px 0" },
  toast: {
    position: "fixed", top: "80px", right: "24px",
    color: "#fff", padding: "12px 20px", borderRadius: "var(--radius-sm)",
    fontWeight: "600", fontSize: "14px", zIndex: 9999, boxShadow: "var(--shadow-lg)",
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 24px" },
  pageHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" },
  title: { fontSize: "26px", fontWeight: "800", color: "var(--dark)" },
  itemCount: {
    background: "var(--primary-light)", color: "var(--primary)",
    padding: "3px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
  },
  emptyBox: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    padding: "72px 40px", textAlign: "center",
    boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-3)",
  },
  emptyIconWrap: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: { fontSize: "20px", fontWeight: "700", color: "var(--dark)", marginBottom: "8px" },
  emptySub: { color: "var(--text-light)", marginBottom: "24px", fontSize: "14px" },
  shopBtn: {
    padding: "12px 28px", background: "var(--primary)",
    color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
    fontWeight: "600", fontSize: "15px",
  },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" },
  itemsPanel: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-3)", overflow: "hidden",
  },
  itemsPanelHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 24px", borderBottom: "1px solid var(--gray-3)",
  },
  panelTitle: { fontWeight: "700", fontSize: "15px", color: "var(--dark)" },
  clearBtn: {
    background: "none", border: "none", color: "var(--danger)",
    fontSize: "13px", fontWeight: "500", cursor: "pointer",
  },
  row: {
    display: "flex", alignItems: "center", gap: "16px",
    padding: "16px 24px", borderBottom: "1px solid var(--gray-2)",
  },
  img: { width: "72px", height: "72px", objectFit: "cover", objectPosition: "center", borderRadius: "var(--radius-sm)", flexShrink: 0 },
  info: { flex: 1 },
  itemName: { fontWeight: "600", fontSize: "14px", color: "var(--dark)", marginBottom: "4px" },
  unitPrice: { color: "var(--text-light)", fontSize: "12px" },
  qtyControl: { display: "flex", alignItems: "center", gap: "2px" },
  qtyBtn: {
    width: "30px", height: "30px", border: "1.5px solid var(--gray-3)",
    borderRadius: "6px", background: "var(--gray-1)",
    fontWeight: "700", fontSize: "16px", color: "var(--text)",
  },
  qty: { minWidth: "36px", textAlign: "center", fontWeight: "700", fontSize: "14px" },
  subtotal: { minWidth: "80px", textAlign: "right", fontWeight: "700", fontSize: "15px", color: "var(--dark)" },
  removeBtn: {
    background: "none", border: "none", color: "var(--gray-4)",
    fontSize: "14px", padding: "4px 6px", cursor: "pointer",
    borderRadius: "4px", transition: "var(--transition)",
  },
  summary: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    padding: "24px", boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--gray-3)", position: "sticky", top: "80px",
  },
  summaryTitle: { fontSize: "16px", fontWeight: "800", color: "var(--dark)", marginBottom: "20px" },
  summaryRows: { display: "flex", flexDirection: "column", gap: "12px" },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "14px", color: "var(--text-light)",
  },
  divider: { height: "1px", background: "var(--gray-3)", margin: "16px 0" },
  totalRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "20px",
    fontSize: "16px", fontWeight: "700", color: "var(--dark)",
  },
  totalAmount: { fontSize: "22px", fontWeight: "800", color: "var(--primary)" },
  addressSection: { marginBottom: "16px" },
  addressLabel: {
    display: "block", fontSize: "13px", fontWeight: "600",
    color: "var(--gray-6)", marginBottom: "8px",
  },
  addressInput: {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid var(--gray-3)", borderRadius: "var(--radius-sm)",
    fontSize: "13px", resize: "vertical", boxSizing: "border-box",
    fontFamily: "inherit", color: "var(--text)", outline: "none",
  },
  orderBtn: {
    width: "100%", padding: "14px",
    background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "var(--radius-sm)",
    fontWeight: "700", fontSize: "15px", transition: "var(--transition)",
  },
  orderBtnLoading: { opacity: 0.7, cursor: "not-allowed" },
};
