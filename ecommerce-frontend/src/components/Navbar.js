import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/login"); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;
  const close = () => setMenuOpen(false);

  return (
    <>
      <nav style={s.nav}>
        <Link to="/" style={s.brand} onClick={close}>
          <span style={s.brandIcon}>S</span>
          <span>ShopZone</span>
        </Link>

        {/* Desktop links */}
        <div style={s.desktopLinks} className="desktop-links">
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

        {/* Hamburger */}
        <button style={s.hamburger} className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ ...s.bar, ...(menuOpen ? s.bar1Open : {}) }} />
          <span style={{ ...s.bar, ...(menuOpen ? s.bar2Open : {}) }} />
          <span style={{ ...s.bar, ...(menuOpen ? s.bar3Open : {}) }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          <Link to="/" style={s.mobileLink} onClick={close}>🏠 Home</Link>
          {user ? (
            <>
              <Link to="/cart" style={s.mobileLink} onClick={close}>🛒 Cart</Link>
              <Link to="/orders" style={s.mobileLink} onClick={close}>📋 Orders</Link>
              <Link to="/profile" style={s.mobileLink} onClick={close}>👤 Profile</Link>
              {user.role === "ADMIN" && (
                <Link to="/admin" style={s.mobileLink} onClick={close}>⚙️ Admin</Link>
              )}
              <div style={s.mobileDivider} />
              <div style={s.mobileUser}>
                <div style={s.avatar}>{user.username?.[0]?.toUpperCase()}</div>
                <span style={s.username}>{user.username}</span>
              </div>
              <button onClick={handleLogout} style={s.mobileLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.mobileLink} onClick={close}>Sign in</Link>
              <Link to="/register" style={{ ...s.mobileLink, color: "var(--primary)", fontWeight: "700" }} onClick={close}>Get started</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

const s = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 20px", height: "64px",
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
  desktopLinks: {
    display: "flex", gap: "4px", alignItems: "center",
    className: "desktop-links",
  },
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
  },
  loginBtn: {
    color: "var(--gray-6)", fontSize: "14px", fontWeight: "500",
    padding: "7px 16px", borderRadius: "var(--radius-sm)",
    border: "1px solid var(--gray-3)",
  },
  registerBtn: {
    color: "#fff", fontSize: "14px", fontWeight: "600",
    padding: "7px 16px", borderRadius: "var(--radius-sm)",
    background: "var(--primary)",
  },
  hamburger: {
    display: "none", flexDirection: "column", gap: "5px",
    background: "none", border: "none", padding: "4px", cursor: "pointer",
  },
  bar: {
    display: "block", width: "24px", height: "2px",
    background: "var(--dark)", borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  bar1Open: { transform: "translateY(7px) rotate(45deg)" },
  bar2Open: { opacity: 0 },
  bar3Open: { transform: "translateY(-7px) rotate(-45deg)" },
  mobileMenu: {
    position: "fixed", top: "64px", left: 0, right: 0,
    background: "var(--white)", borderBottom: "1px solid var(--gray-3)",
    padding: "12px 20px 20px", zIndex: 999,
    boxShadow: "var(--shadow-lg)",
    display: "flex", flexDirection: "column", gap: "4px",
  },
  mobileLink: {
    padding: "12px 16px", fontSize: "15px", fontWeight: "500",
    color: "var(--text)", borderRadius: "var(--radius-sm)",
    display: "block",
  },
  mobileDivider: { height: "1px", background: "var(--gray-3)", margin: "8px 0" },
  mobileUser: { display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px" },
  mobileLogout: {
    margin: "8px 0 0", padding: "12px 16px",
    background: "var(--danger-light)", color: "var(--danger)",
    border: "1px solid #fecaca", borderRadius: "var(--radius-sm)",
    fontWeight: "600", fontSize: "14px", textAlign: "left",
  },
};
