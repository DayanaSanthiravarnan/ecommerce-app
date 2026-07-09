import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/login"); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={s.nav}>
        <Link to="/" style={s.brand}>
          <span style={s.brandIcon}>S</span>
          <span>ShopZone</span>
        </Link>

        <div style={s.links}>
          <Link to="/" style={{ ...s.link, ...(isActive("/") ? s.activeLink : {}) }}>Home</Link>
          {user ? (
            <>
              <Link to="/cart" style={{ ...s.link, ...(isActive("/cart") ? s.activeLink : {}) }}>Cart</Link>
              <Link to="/orders" style={{ ...s.link, ...(isActive("/orders") ? s.activeLink : {}) }}>Orders</Link>
              <Link to="/profile" style={{ ...s.link, ...(isActive("/profile") ? s.activeLink : {}) }}>Profile</Link>
              {user.role === "ADMIN" && (
                <Link to="/admin" style={{ ...s.link, ...(isActive("/admin") ? s.activeLink : {}) }}>Admin</Link>
              )}
              <div style={s.divider} />
              <div style={s.userMenu}>
                <div style={s.avatar}>{user.username?.[0]?.toUpperCase()}</div>
                <span style={s.username}>{user.username}</span>
                <button onClick={handleLogout} style={s.logoutBtn}>Sign out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={s.loginBtn}>Sign in</Link>
              <Link to="/register" style={s.registerBtn}>Get started</Link>
            </>
          )}
        </div>
      </nav>
      <style>{`
        nav a:hover { opacity: 0.85; }
        .logout-btn:hover { background: #f1f5f9 !important; }
      `}</style>
    </>
  );
}

const s = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 40px", height: "64px",
    background: "var(--white)", borderBottom: "1px solid var(--gray-3)",
    position: "sticky", top: 0, zIndex: 1000,
    boxShadow: "var(--shadow-sm)",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "10px",
    color: "var(--dark)", fontWeight: "800", fontSize: "20px", letterSpacing: "-0.5px",
  },
  brandIcon: {
    width: "32px", height: "32px", borderRadius: "8px",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "800",
  },
  links: { display: "flex", gap: "4px", alignItems: "center" },
  link: {
    color: "var(--gray-5)", fontSize: "14px", fontWeight: "500",
    padding: "6px 12px", borderRadius: "var(--radius-sm)",
    transition: "var(--transition)",
  },
  activeLink: { color: "var(--primary)", background: "var(--primary-light)", fontWeight: "600" },
  divider: { width: "1px", height: "24px", background: "var(--gray-3)", margin: "0 8px" },
  userMenu: { display: "flex", alignItems: "center", gap: "8px" },
  avatar: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: "700",
  },
  username: { fontSize: "13px", fontWeight: "600", color: "var(--text)" },
  logoutBtn: {
    background: "transparent", color: "var(--gray-5)",
    border: "1px solid var(--gray-3)", padding: "5px 12px",
    borderRadius: "var(--radius-sm)", fontSize: "13px", fontWeight: "500",
    transition: "var(--transition)",
  },
  loginBtn: {
    color: "var(--gray-6)", fontSize: "14px", fontWeight: "500",
    padding: "7px 16px", borderRadius: "var(--radius-sm)",
    border: "1px solid var(--gray-3)", transition: "var(--transition)",
  },
  registerBtn: {
    color: "#fff", fontSize: "14px", fontWeight: "600",
    padding: "7px 16px", borderRadius: "var(--radius-sm)",
    background: "var(--primary)", transition: "var(--transition)",
  },
};
