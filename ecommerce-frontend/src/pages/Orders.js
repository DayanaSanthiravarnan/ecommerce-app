import { useEffect, useState } from "react";
import api from "../api/axios";
import ServerError from "../components/ServerError";

const STATUS = {
  PENDING:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Pending" },
  CONFIRMED: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "Confirmed" },
  SHIPPED:   { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", label: "Shipped" },
  DELIVERED: { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "Delivered" },
  CANCELLED: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Cancelled" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const fetchOrders = async () => {
    try { const r = await api.get("/orders"); setOrders(r.data); setError(""); }
    catch (err) { setOrders([]); if (!err.response) setError("Cannot connect to server. Please make sure the backend is running."); }
  };
  useEffect(() => { fetchOrders(); }, []);

  const cancel = async (id) => {
    try {
      await api.put(`/orders/${id}/cancel`);
      setMsg("Order cancelled successfully."); setMsgType("success");
      setTimeout(() => setMsg(""), 3000); fetchOrders();
    } catch (err) {
      setMsg(err.response?.data?.message || "Cannot cancel order"); setMsgType("error");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div style={s.page}>
      {msg && (
        <div style={{ ...s.toast, background: msgType === "success" ? "var(--success)" : "var(--danger)" }}>
          {msgType === "success" ? "✓ " : "✕ "}{msg}
        </div>
      )}

      <div style={s.container}>
        <h2 style={s.title}>My Orders</h2>

        {error && <ServerError message={error} />}

        {!error && orders.length === 0 && (
          <div style={s.emptyBox}>
            <div style={s.emptyIcon}>📋</div>
            <h3 style={s.emptyTitle}>No orders yet</h3>
            <p style={s.emptySub}>Your order history will appear here once you make a purchase.</p>
          </div>
        )}

        <div style={s.orderList}>
          {orders.map((order) => {
            const sc = STATUS[order.status] || { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", label: order.status };
            return (
              <div key={order.id} style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.orderMeta}>
                    <span style={s.orderId}>Order #{order.id}</span>
                    <span style={s.dot}>·</span>
                    <span style={s.date}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div style={s.headerRight}>
                    <span style={{ ...s.badge, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>
                      {sc.label}
                    </span>
                    {order.status === "PENDING" && (
                      <button style={s.cancelBtn} onClick={() => cancel(order.id)}>Cancel Order</button>
                    )}
                  </div>
                </div>

                <div style={s.addressRow}>
                  <span style={s.addressIcon}>📍</span>
                  <span style={s.addressText}>{order.shippingAddress}</span>
                </div>

                <div style={s.itemsSection}>
                  {order.orderItems.map((oi) => (
                    <div key={oi.id} style={s.itemRow}>
                      <span style={s.itemName}>{oi.product.name}</span>
                      <span style={s.itemQty}>× {oi.quantity}</span>
                      <span style={s.itemPrice}>₹{(oi.price * oi.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div style={s.cardFooter}>
                  <span style={s.totalLabel}>Order Total</span>
                  <span style={s.totalAmount}>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
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
  container: { maxWidth: "860px", margin: "0 auto", padding: "0 24px" },
  title: { fontSize: "26px", fontWeight: "800", color: "var(--dark)", marginBottom: "28px" },
  emptyBox: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    padding: "72px 40px", textAlign: "center",
    boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-3)",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "14px" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "var(--dark)", marginBottom: "8px" },
  emptySub: { color: "var(--text-light)", fontSize: "14px" },
  orderList: { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-3)",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 24px", borderBottom: "1px solid var(--gray-2)",
    flexWrap: "wrap", gap: "10px",
  },
  orderMeta: { display: "flex", alignItems: "center", gap: "8px" },
  orderId: { fontSize: "15px", fontWeight: "700", color: "var(--dark)" },
  dot: { color: "var(--gray-4)" },
  date: { fontSize: "13px", color: "var(--text-light)" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px" },
  badge: {
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "12px", fontWeight: "700",
  },
  cancelBtn: {
    padding: "6px 14px", background: "var(--white)",
    color: "var(--danger)", border: "1px solid var(--danger)",
    borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: "600",
  },
  addressRow: {
    display: "flex", alignItems: "flex-start", gap: "8px",
    padding: "12px 24px", background: "var(--gray-1)",
    borderBottom: "1px solid var(--gray-2)",
  },
  addressIcon: { fontSize: "13px", marginTop: "1px" },
  addressText: { fontSize: "13px", color: "var(--text-light)" },
  itemsSection: { padding: "8px 24px" },
  itemRow: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 0", borderBottom: "1px dashed var(--gray-2)",
  },
  itemName: { flex: 1, fontSize: "14px", color: "var(--text)" },
  itemQty: { fontSize: "13px", color: "var(--text-light)", minWidth: "40px" },
  itemPrice: { fontSize: "14px", fontWeight: "600", color: "var(--dark)", minWidth: "80px", textAlign: "right" },
  cardFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 24px", borderTop: "1px solid var(--gray-3)",
    background: "var(--gray-1)",
  },
  totalLabel: { fontSize: "13px", color: "var(--text-light)", fontWeight: "500" },
  totalAmount: { fontSize: "18px", fontWeight: "800", color: "var(--primary)" },
};
