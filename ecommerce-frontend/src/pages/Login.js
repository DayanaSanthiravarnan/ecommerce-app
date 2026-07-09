import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      if (!err.response) setError("Cannot connect to server. Please make sure the backend is running.");
      else setError("Invalid username or password. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.left}>
          <div style={s.leftContent}>
            <div style={s.brandMark}>S</div>
            <h1 style={s.leftTitle}>ShopZone</h1>
            <p style={s.leftSub}>Your one-stop destination for everything you need.</p>
            <div style={s.features}>
              {["Free shipping on orders", "Easy returns & refunds", "Secure checkout"].map((f) => (
                <div key={f} style={s.feature}>
                  <span style={s.featureCheck}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.right}>
          <div style={s.form}>
            <h2 style={s.title}>Welcome back</h2>
            <p style={s.sub}>Sign in to your account to continue</p>

            {error && (
              <div style={s.errorBox}>
                <span style={s.errorIcon}>!</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={s.formInner}>
              <div style={s.field}>
                <label style={s.label}>Username</label>
                <input
                  style={s.input} placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Password</label>
                <input
                  style={s.input} type="password" placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button style={{ ...s.btn, ...(loading ? s.btnLoading : {}) }} type="submit" disabled={loading}>
                {loading ? (
                  <span style={s.btnInner}><span style={s.spinner} /> Signing in...</span>
                ) : "Sign In"}
              </button>
            </form>

            <p style={s.footer}>
              Don't have an account?{" "}
              <Link to="/register" style={s.linkText}>Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", background: "var(--gray-1)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
  },
  card: {
    display: "flex", width: "100%", maxWidth: "900px",
    borderRadius: "20px", overflow: "hidden",
    boxShadow: "var(--shadow-lg)",
  },
  left: {
    flex: 1, background: "linear-gradient(145deg, #0f172a 0%, #1e3a8a 100%)",
    padding: "48px 40px", display: "flex", alignItems: "center",
  },
  leftContent: { color: "#fff" },
  brandMark: {
    width: "48px", height: "48px", borderRadius: "12px",
    background: "var(--primary)", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "22px", fontWeight: "800",
    marginBottom: "16px",
  },
  leftTitle: { fontSize: "28px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.5px" },
  leftSub: { color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: "1.6", marginBottom: "32px" },
  features: { display: "flex", flexDirection: "column", gap: "12px" },
  feature: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.8)" },
  featureCheck: {
    width: "20px", height: "20px", borderRadius: "50%",
    background: "rgba(37,99,235,0.4)", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: "11px", color: "#93c5fd", flexShrink: 0,
  },
  right: {
    flex: 1, background: "var(--white)",
    padding: "48px 40px", display: "flex", alignItems: "center",
  },
  form: { width: "100%" },
  title: { fontSize: "26px", fontWeight: "800", color: "var(--dark)", marginBottom: "6px", letterSpacing: "-0.5px" },
  sub: { color: "var(--text-light)", fontSize: "14px", marginBottom: "28px" },
  errorBox: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "var(--danger-light)", border: "1px solid #fecaca",
    color: "var(--danger)", padding: "12px 14px", borderRadius: "var(--radius-sm)",
    fontSize: "13px", marginBottom: "20px",
  },
  errorIcon: {
    width: "20px", height: "20px", borderRadius: "50%",
    background: "var(--danger)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", flexShrink: 0,
  },
  formInner: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "var(--gray-6)" },
  input: {
    padding: "11px 14px", border: "1.5px solid var(--gray-3)",
    borderRadius: "var(--radius-sm)", fontSize: "14px", outline: "none",
    transition: "border-color 0.2s", color: "var(--text)",
    background: "var(--white)",
  },
  btn: {
    padding: "13px", background: "var(--primary)",
    color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
    fontSize: "15px", fontWeight: "600", marginTop: "4px",
    transition: "var(--transition)",
  },
  btnLoading: { opacity: 0.7, cursor: "not-allowed" },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  spinner: {
    width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block",
  },
  footer: { textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-light)" },
  linkText: { color: "var(--primary)", fontWeight: "600" },
};
