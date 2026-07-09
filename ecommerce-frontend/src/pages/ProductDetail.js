import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ServerError from "../components/ServerError";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => setError("Product not found or server error."));
  }, [id]);

  const flash = (text, type = "success") => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 2500);
  };

  const addToCart = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post("/cart/add", { productId: product.id, quantity: 1 });
      flash("Added to cart!");
    } catch (err) {
      flash(err.response?.data?.message || "Error adding to cart", "error");
    }
  };

  const buyNow = () => {
    if (!user) return navigate("/login");
    navigate("/checkout", { state: { product } });
  };

  if (error) return <div style={s.page}><ServerError message={error} /></div>;
  if (!product) return <div style={s.page}><div style={s.loading}><div style={s.spinner} /></div></div>;

  return (
    <div style={s.page}>
      {msg && (
        <div style={{ ...s.toast, background: msgType === "success" ? "var(--success)" : "var(--danger)" }}>
          {msgType === "success" ? "✓ " : "✕ "}{msg}
        </div>
      )}
      <div style={s.container}>
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
        <div style={s.card} className="product-detail-grid">
          <div style={s.imgWrap}>
            <img
              src={product.imageUrl || "https://via.placeholder.com/500x400?text=No+Image"}
              alt={product.name}
              style={s.img}
            />
            {product.stock === 0 && <div style={s.outBadge}>Out of Stock</div>}
            {product.category && <div style={s.catBadge}>{product.category.name}</div>}
          </div>
          <div style={s.info} className="product-detail-info">
            <h1 style={s.name}>{product.name}</h1>
            {product.description && <p style={s.desc}>{product.description}</p>}
            <div style={s.priceRow}>
              <span style={s.price}>Rs. {product.price.toLocaleString()}</span>
              {product.stock > 0 && product.stock <= 5 && (
                <span style={s.lowStock}>Only {product.stock} left!</span>
              )}
              {product.stock > 5 && <span style={s.inStock}>✓ In Stock</span>}
            </div>
            <div style={s.payBadge}>💵 Cash on Delivery available</div>
            <div style={s.actions} className="product-actions">
              <button
                style={{ ...s.cartBtn, ...(product.stock === 0 ? s.disabled : {}) }}
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </button>
              <button
                style={{ ...s.buyBtn, ...(product.stock === 0 ? s.disabled : {}) }}
                onClick={buyNow}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Buy Now →"}
              </button>
            </div>
          </div>
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
  container: { maxWidth: "960px", margin: "0 auto", padding: "0 24px" },
  back: {
    background: "none", border: "none", color: "var(--primary)",
    fontWeight: "600", fontSize: "14px", marginBottom: "20px",
    cursor: "pointer", padding: 0,
  },
  card: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px",
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-3)",
    overflow: "hidden",
  },
  imgWrap: { position: "relative", overflow: "hidden" },
  img: { width: "100%", height: "100%", minHeight: "420px", objectFit: "cover", objectPosition: "center", display: "block" },
  outBadge: {
    position: "absolute", top: "14px", left: "14px",
    background: "rgba(15,23,42,0.75)", color: "#fff",
    fontSize: "12px", padding: "4px 10px", borderRadius: "4px", fontWeight: "600",
  },
  catBadge: {
    position: "absolute", top: "14px", right: "14px",
    background: "var(--primary)", color: "#fff",
    fontSize: "11px", padding: "4px 10px", borderRadius: "4px",
    fontWeight: "700", textTransform: "uppercase",
  },
  info: { padding: "36px 36px 36px 0", display: "flex", flexDirection: "column", gap: "16px" },
  name: { fontSize: "26px", fontWeight: "800", color: "var(--dark)", lineHeight: 1.2 },
  desc: { fontSize: "14px", color: "var(--text-light)", lineHeight: 1.7 },
  priceRow: { display: "flex", alignItems: "center", gap: "12px" },
  price: { fontSize: "32px", fontWeight: "800", color: "var(--dark)" },
  lowStock: { fontSize: "12px", color: "var(--accent)", fontWeight: "700" },
  inStock: { fontSize: "13px", color: "var(--success)", fontWeight: "600" },
  payBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    color: "#15803d", fontSize: "13px", fontWeight: "600",
    padding: "8px 14px", borderRadius: "var(--radius-sm)",
  },
  actions: { display: "flex", gap: "12px", marginTop: "8px" },
  cartBtn: {
    flex: 1, padding: "14px", background: "var(--white)",
    color: "var(--primary)", border: "2px solid var(--primary)",
    borderRadius: "var(--radius-sm)", fontWeight: "700", fontSize: "15px",
  },
  buyBtn: {
    flex: 1, padding: "14px", background: "var(--primary)",
    color: "#fff", border: "none",
    borderRadius: "var(--radius-sm)", fontWeight: "700", fontSize: "15px",
  },
  disabled: { opacity: 0.4, cursor: "not-allowed" },
  loading: { display: "flex", justifyContent: "center", padding: "120px 0" },
  spinner: {
    width: "40px", height: "40px", border: "3px solid var(--gray-3)",
    borderTop: "3px solid var(--primary)", borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
