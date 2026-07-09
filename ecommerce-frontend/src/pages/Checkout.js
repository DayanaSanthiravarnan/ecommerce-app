import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const [form, setForm] = useState({
    fullName: "", phone: "", addressLine: "", city: "", pincode: "",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (!product) {
    navigate("/");
    return null;
  }

  const shippingAddress = `${form.fullName}, ${form.phone}, ${form.addressLine}, ${form.city} - ${form.pincode}`;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOrder = async (e) => {
    e.preventDefault();
    const { fullName, phone, addressLine, city, pincode } = form;
    if (!fullName || !phone || !addressLine || !city || !pincode)
      return setError("Please fill all fields.");
    if (!/^\d{10}$/.test(phone))
      return setError("Enter a valid 10-digit phone number.");
    if (!/^\d{6}$/.test(pincode))
      return setError("Enter a valid 6-digit pincode.");

    setError(""); setPlacing(true);
    try {
      // Add to cart first, then place order
      await api.post("/cart/add", { productId: product.id, quantity: 1 });
      await api.post("/orders/place", { shippingAddress });
      navigate("/orders", { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Try again.");
    } finally { setPlacing(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
        <h2 style={s.heading}>Checkout</h2>

        <div style={s.layout}>
          {/* Address Form */}
          <div style={s.formCard}>
            <h3 style={s.sectionTitle}>📦 Delivery Details</h3>
            <form onSubmit={handleOrder} style={s.form}>
              {[
                { name: "fullName", label: "Full Name", placeholder: "Enter your full name" },
                { name: "phone", label: "Phone Number", placeholder: "10-digit mobile number" },
                { name: "addressLine", label: "Address", placeholder: "House no, Street, Area" },
                { name: "city", label: "City", placeholder: "City / Town" },
                { name: "pincode", label: "Pincode", placeholder: "6-digit pincode" },
              ].map(({ name, label, placeholder }) => (
                <div key={name} style={s.field}>
                  <label style={s.label}>{label}</label>
                  <input
                    style={s.input}
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              {error && <div style={s.errorBox}>⚠ {error}</div>}

              <div style={s.codBadge}>
                <span style={s.codIcon}>💵</span>
                <div>
                  <p style={s.codTitle}>Cash on Delivery</p>
                  <p style={s.codSub}>Pay when your order arrives at your door</p>
                </div>
              </div>

              <button
                style={{ ...s.orderBtn, ...(placing ? s.orderBtnLoading : {}) }}
                type="submit"
                disabled={placing}
              >
                {placing ? "Placing Order..." : "Confirm Order →"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={s.summary}>
            <h3 style={s.sectionTitle}>🛍 Order Summary</h3>
            <div style={s.productRow}>
              <img
                src={product.imageUrl || "https://via.placeholder.com/80"}
                alt={product.name}
                style={s.productImg}
              />
              <div style={s.productInfo}>
                <p style={s.productName}>{product.name}</p>
                {product.category && <p style={s.productCat}>{product.category.name}</p>}
              </div>
            </div>
            <div style={s.divider} />
            <div style={s.summaryRow}>
              <span>Price</span>
              <span>Rs. {product.price.toLocaleString()}</span>
            </div>
            <div style={s.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: "var(--success)", fontWeight: "600" }}>Free</span>
            </div>
            <div style={s.summaryRow}>
              <span>Payment</span>
              <span style={{ fontWeight: "600" }}>Cash on Delivery</span>
            </div>
            <div style={s.divider} />
            <div style={s.totalRow}>
              <span>Total</span>
              <span style={s.totalAmount}>Rs. {product.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: "var(--gray-1)", minHeight: "100vh", padding: "36px 0" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "0 24px" },
  back: {
    background: "none", border: "none", color: "var(--primary)",
    fontWeight: "600", fontSize: "14px", marginBottom: "16px",
    cursor: "pointer", padding: 0,
  },
  heading: { fontSize: "26px", fontWeight: "800", color: "var(--dark)", marginBottom: "28px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" },
  formCard: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    padding: "28px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-3)",
  },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "var(--dark)", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "var(--gray-6)" },
  input: {
    padding: "11px 14px", border: "1.5px solid var(--gray-3)",
    borderRadius: "var(--radius-sm)", fontSize: "14px",
    outline: "none", color: "var(--text)",
  },
  errorBox: {
    background: "#fef2f2", border: "1px solid #fecaca",
    color: "var(--danger)", padding: "10px 14px",
    borderRadius: "var(--radius-sm)", fontSize: "13px",
  },
  codBadge: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    borderRadius: "var(--radius-sm)", padding: "14px",
  },
  codIcon: { fontSize: "24px" },
  codTitle: { fontWeight: "700", fontSize: "14px", color: "#15803d" },
  codSub: { fontSize: "12px", color: "#16a34a", marginTop: "2px" },
  orderBtn: {
    padding: "14px", background: "var(--primary)", color: "#fff",
    border: "none", borderRadius: "var(--radius-sm)",
    fontWeight: "700", fontSize: "15px",
  },
  orderBtnLoading: { opacity: 0.7, cursor: "not-allowed" },
  summary: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    padding: "24px", boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--gray-3)", position: "sticky", top: "80px",
  },
  productRow: { display: "flex", gap: "14px", marginBottom: "16px", alignItems: "center" },
  productImg: { width: "72px", height: "72px", objectFit: "cover", borderRadius: "var(--radius-sm)" },
  productInfo: { flex: 1 },
  productName: { fontWeight: "700", fontSize: "14px", color: "var(--dark)" },
  productCat: { fontSize: "12px", color: "var(--text-light)", marginTop: "4px" },
  divider: { height: "1px", background: "var(--gray-3)", margin: "14px 0" },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "14px", color: "var(--text-light)", marginBottom: "10px",
  },
  totalRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "16px", fontWeight: "700", color: "var(--dark)",
  },
  totalAmount: { fontSize: "22px", fontWeight: "800", color: "var(--primary)" },
};
