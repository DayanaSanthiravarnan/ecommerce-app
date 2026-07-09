import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      if (!err.response) setError("Cannot connect to server. Please make sure the backend is running.");
      else setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const fields = [
    { key: "name",     label: "Full Name",      type: "text",     placeholder: "John Doe",          half: false },
    { key: "email",    label: "Email Address",  type: "email",    placeholder: "john@example.com",  half: false },
    { key: "username", label: "Username",       type: "text",     placeholder: "johndoe",           half: true  },
    { key: "password", label: "Password",       type: "password", placeholder: "Min. 6 characters", half: true  },
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.brandMark}>S</div>
          <div>
            <h2 style={s.title}>Create your account</h2>
            <p style={s.sub}>Join ShopZone and start shopping today</p>
          </div>
        </div>

        {error && (
          <div style={s.errorBox}>
            <span style={s.errorIcon}>!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.grid} className="register-grid">
            {fields.map(({ key, label, type, placeholder, half }) => (
              <div key={key} style={{ ...s.field, ...(half ? {} : s.fullWidth) }}>
                <label style={s.label}>{label}</label>
                <input
                  style={s.input} type={type} placeholder={placeholder}
                  value={form[key]} onChange={update(key)} required
                />
              </div>
            ))}
          </div>
          <button style={{ ...s.btn, ...(loading ? s.btnLoading : {}) }} type="submit" disabled={loading}>
            {loading ? (
              <span style={s.btnInner}><span style={s.spinner} /> Creating account...</span>
            ) : "Create Account"}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{" "}
          <Link to="/login" style={s.linkText}>Sign in</Link>
        </p>
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
    background: "var(--white)", borderRadius: "20px",
    padding: "40px", width: "100%", maxWidth: "480px",
    boxShadow: "var(--shadow-lg)",
  },
  header: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" },
  brandMark: {
    width: "44px", height: "44px", borderRadius: "10px",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "20px", fontWeight: "800", flexShrink: 0,
  },
  title: { fontSize: "22px", fontWeight: "800", color: "var(--dark)", letterSpacing: "-0.5px" },
  sub: { color: "var(--text-light)", fontSize: "13px", marginTop: "2px" },
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
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  fullWidth: { gridColumn: "1 / -1" },
  label: { fontSize: "13px", fontWeight: "600", color: "var(--gray-6)" },
  input: {
    padding: "11px 14px", border: "1.5px solid var(--gray-3)",
    borderRadius: "var(--radius-sm)", fontSize: "14px", outline: "none",
    transition: "border-color 0.2s", color: "var(--text)",
  },
  btn: {
    padding: "13px", background: "var(--primary)",
    color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
    fontSize: "15px", fontWeight: "600", transition: "var(--transition)",
  },
  btnLoading: { opacity: 0.7, cursor: "not-allowed" },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  spinner: {
    width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block",
  },
  footer: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--text-light)" },
  linkText: { color: "var(--primary)", fontWeight: "600" },
};
