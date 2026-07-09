import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ServerError from "../components/ServerError";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true); setError("");
    try {
      if (search) {
        const res = await api.get(`/products/search?name=${encodeURIComponent(search)}`);
        setProducts(res.data); setTotalPages(1);
      } else if (categoryId) {
        const res = await api.get(`/products/category/${categoryId}`);
        setProducts(res.data); setTotalPages(1);
      } else {
        const res = await api.get(`/products?page=${page}&size=8&sortBy=id`);
        setProducts(res.data.content); setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      setProducts([]);
      if (!err.response) setError("Cannot connect to server. Please make sure the backend is running.");
      else setError("Failed to load products. Please try again.");
    } finally { setLoading(false); }
  };

  useEffect(() => { api.get("/categories").then((r) => setCategories(r.data)).catch(() => {}); }, []);
  useEffect(() => { fetchProducts(); }, [page, categoryId]);

  const handleSearch = (e) => { e.preventDefault(); setPage(0); setCategoryId(""); fetchProducts(); };

  const showMsg = (text, type = "success") => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 2500);
  };

  const addToCart = async (productId) => {
    if (!user) return navigate("/login");
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      showMsg("Added to cart!");
    } catch (err) {
      showMsg(err.response?.data?.message || "Error adding to cart", "error");
    }
  };

  return (
    <div style={s.page}>
      {/* Toast */}
      {msg && (
        <div style={{ ...s.toast, background: msgType === "success" ? "var(--success)" : "var(--danger)" }}>
          {msgType === "success" ? "✓ " : "✕ "}{msg}
        </div>
      )}

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <p style={s.heroEyebrow}>New arrivals every week</p>
          <h1 style={s.heroTitle}>Find What You Love</h1>
          <p style={s.heroSub}>Discover thousands of products at unbeatable prices</p>
        </div>
      </div>

      <div style={s.container}>
        {error && <ServerError message={error} />}

        {/* Filters */}
        <div style={s.filterBar}>
          <form onSubmit={handleSearch} style={s.searchForm}>
            <div style={s.searchWrap}>
              <span style={s.searchIcon}>⌕</span>
              <input
                style={s.searchInput}
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (!e.target.value) { setCategoryId(""); setPage(0); fetchProducts(); }
                }}
              />
            </div>
            <button style={s.searchBtn} type="submit">Search</button>
          </form>
          <select
            style={s.select}
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setSearch(""); setPage(0); }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Results info */}
        {!loading && !error && (
          <p style={s.resultsInfo}>
            {search ? `Results for "${search}"` : categoryId ? "Filtered products" : "All products"}
            <span style={s.resultsCount}> — {products.length} item{products.length !== 1 ? "s" : ""}</span>
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div style={s.loadingBox}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Loading products...</p>
          </div>
        ) : (
          <div style={s.grid}>
            {!error && products.length === 0 && (
              <div style={s.emptyBox}>
                <p style={s.emptyIcon}>🔍</p>
                <p style={s.emptyTitle}>No products found</p>
                <p style={s.emptySub}>Try a different search or category</p>
              </div>
            )}
            {products.map((p) => (
              <div key={p.id} style={s.card} className="product-card">
                <div style={s.imgWrap}>
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={p.name}
                    style={s.img}
                  />
                  {p.stock === 0 && <div style={s.outBadge}>Out of Stock</div>}
                  {p.category && <div style={s.catBadge}>{p.category.name}</div>}
                </div>
                <div style={s.cardBody}>
                  <h4 style={s.name}>{p.name}</h4>
                  <p style={s.desc}>{p.description || ""}</p>
                  <div style={s.cardFooter}>
                    <div>
                      <span style={s.price}>Rs. {p.price.toLocaleString()}</span>
                      {p.stock > 0 && p.stock <= 5 && (
                        <span style={s.lowStock}>Only {p.stock} left</span>
                      )}
                    </div>
                    <div style={s.btnGroup}>
                      <button
                        style={s.viewBtn}
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        View
                      </button>
                      <button
                        style={{ ...s.cartBtn, ...(p.stock === 0 ? s.cartBtnDisabled : {}) }}
                        onClick={() => addToCart(p.id)}
                        disabled={p.stock === 0}
                      >
                        {p.stock === 0 ? "Sold Out" : "+ Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!search && !categoryId && totalPages > 1 && (
          <div style={s.pagination}>
            <button
              style={{ ...s.pageBtn, ...(page === 0 ? s.pageBtnDisabled : {}) }}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >← Previous</button>
            <span style={s.pageInfo}>Page {page + 1} of {totalPages}</span>
            <button
              style={{ ...s.pageBtn, ...(page + 1 >= totalPages ? s.pageBtnDisabled : {}) }}
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
            >Next →</button>
          </div>
        )}
      </div>

      <style>{`
        .product-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
      `}</style>
    </div>
  );
}

const s = {
  page: { background: "var(--gray-1)", minHeight: "100vh" },
  toast: {
    position: "fixed", top: "80px", right: "24px",
    color: "#fff", padding: "12px 20px", borderRadius: "var(--radius-sm)",
    fontWeight: "600", fontSize: "14px", zIndex: 9999,
    boxShadow: "var(--shadow-lg)", animation: "slideDown 0.3s ease",
  },
  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
    padding: "72px 40px", textAlign: "center",
  },
  heroContent: { maxWidth: "600px", margin: "0 auto" },
  heroEyebrow: {
    color: "#93c5fd", fontSize: "13px", fontWeight: "600",
    textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px",
  },
  heroTitle: {
    color: "#fff", fontSize: "48px", fontWeight: "800",
    letterSpacing: "-1.5px", lineHeight: "1.1", marginBottom: "14px",
  },
  heroSub: { color: "rgba(255,255,255,0.65)", fontSize: "16px" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "36px 24px" },
  filterBar: {
    display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap",
    background: "var(--white)", padding: "16px 20px",
    borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--gray-3)",
  },
  searchForm: { display: "flex", gap: "8px", flex: 1 },
  searchWrap: { flex: 1, position: "relative", display: "flex", alignItems: "center" },
  searchIcon: {
    position: "absolute", left: "12px", color: "var(--gray-4)",
    fontSize: "18px", pointerEvents: "none",
  },
  searchInput: {
    width: "100%", padding: "10px 14px 10px 36px",
    border: "1.5px solid var(--gray-3)", borderRadius: "var(--radius-sm)",
    fontSize: "14px", outline: "none", color: "var(--text)",
    minWidth: "200px",
  },
  searchBtn: {
    padding: "10px 20px", background: "var(--dark)",
    color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
    fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap",
  },
  select: {
    padding: "10px 14px", border: "1.5px solid var(--gray-3)",
    borderRadius: "var(--radius-sm)", fontSize: "14px",
    background: "var(--white)", color: "var(--text)", cursor: "pointer",
  },
  resultsInfo: { fontSize: "14px", color: "var(--text-light)", marginBottom: "20px" },
  resultsCount: { color: "var(--gray-4)" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    overflow: "hidden", boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--gray-3)",
    display: "flex", flexDirection: "column",
  },
  imgWrap: { position: "relative", overflow: "hidden", flex: "0 0 auto" },
  img: { width: "100%", height: "220px", objectFit: "cover", objectPosition: "center", display: "block" },
  outBadge: {
    position: "absolute", top: "10px", left: "10px",
    background: "rgba(15,23,42,0.75)", color: "#fff",
    fontSize: "11px", padding: "3px 8px", borderRadius: "4px", fontWeight: "600",
  },
  catBadge: {
    position: "absolute", top: "10px", right: "10px",
    background: "var(--primary)", color: "#fff",
    fontSize: "10px", padding: "3px 8px", borderRadius: "4px",
    fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px",
  },
  cardBody: { padding: "12px 14px 14px", display: "flex", flexDirection: "column", flex: 1 },
  name: { fontSize: "14px", fontWeight: "700", color: "var(--dark)", marginBottom: "4px", lineHeight: "1.3" },
  desc: {
    fontSize: "12px", color: "var(--text-light)", marginBottom: "10px",
    overflow: "hidden", display: "-webkit-box",
    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.4",
    flex: 1,
  },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" },
  price: { fontSize: "18px", fontWeight: "800", color: "var(--dark)", display: "block" },
  lowStock: {
    fontSize: "11px", color: "var(--accent)", fontWeight: "600",
    display: "block", marginTop: "2px",
  },
  cartBtn: {
    padding: "8px 14px", background: "var(--primary)",
    color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
    fontWeight: "600", fontSize: "13px", transition: "var(--transition)",
  },
  viewBtn: {
    padding: "8px 14px", background: "var(--white)",
    color: "var(--primary)", border: "1.5px solid var(--primary)",
    borderRadius: "var(--radius-sm)", fontWeight: "600", fontSize: "13px",
  },
  btnGroup: { display: "flex", gap: "6px" },
  cartBtnDisabled: { background: "var(--gray-3)", color: "var(--gray-4)", cursor: "not-allowed" },
  loadingBox: { textAlign: "center", padding: "80px 0" },
  spinner: {
    width: "40px", height: "40px", border: "3px solid var(--gray-3)",
    borderTop: "3px solid var(--primary)", borderRadius: "50%",
    margin: "0 auto", animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "var(--text-light)", marginTop: "14px", fontSize: "14px" },
  emptyBox: { gridColumn: "1/-1", textAlign: "center", padding: "80px 0" },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyTitle: { fontSize: "18px", fontWeight: "700", color: "var(--dark)", marginBottom: "6px" },
  emptySub: { color: "var(--text-light)", fontSize: "14px" },
  pagination: {
    display: "flex", justifyContent: "center", alignItems: "center",
    gap: "12px", marginTop: "48px",
  },
  pageBtn: {
    padding: "9px 18px", border: "1.5px solid var(--gray-3)",
    borderRadius: "var(--radius-sm)", background: "var(--white)",
    fontWeight: "600", fontSize: "13px", color: "var(--text)",
    transition: "var(--transition)",
  },
  pageBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  pageInfo: { fontSize: "13px", color: "var(--text-light)", fontWeight: "500" },
};
