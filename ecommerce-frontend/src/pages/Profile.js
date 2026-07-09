import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ServerError from "../components/ServerError";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [pwdMsg, setPwdMsg] = useState({ text: "", type: "" });
  const [error, setError] = useState("");

  const flash = (setter, text, type) => {
    setter({ text, type });
    setTimeout(() => setter({ text: "", type: "" }), 3000);
  };

  const updateProfile = async (e) => {
    e.preventDefault(); setError("");
    try {
      await api.put("/user/profile", profile);
      flash(setProfileMsg, "Profile updated successfully!", "success");
    } catch (err) {
      if (!err.response) setError("Cannot connect to server. Please make sure the backend is running.");
      else flash(setProfileMsg, err.response?.data?.message || "Error updating profile", "error");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault(); setError("");
    try {
      await api.put("/user/password", pwd);
      flash(setPwdMsg, "Password changed successfully!", "success");
      setPwd({ currentPassword: "", newPassword: "" });
    } catch (err) {
      if (!err.response) setError("Cannot connect to server. Please make sure the backend is running.");
      else flash(setPwdMsg, err.response?.data?.message || "Error changing password", "error");
    }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  const isAdmin = user?.role === "ADMIN";

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Profile Header */}
        <div style={s.profileHeader}>
          <div style={s.avatarWrap}>
            <div style={s.avatar}>{initials}</div>
          </div>
          <div style={s.headerInfo}>
            <h2 style={s.name}>{user?.name}</h2>
            <p style={s.username}>@{user?.username}</p>
            <p style={s.email}>{user?.email}</p>
          </div>
          <span style={{ ...s.roleBadge, ...(isAdmin ? s.adminBadge : s.userBadge) }}>
            {isAdmin ? "Admin" : "Customer"}
          </span>
        </div>

        {error && <ServerError message={error} />}

        <div style={s.grid}>
          {/* Update Profile */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Update Profile</h3>
            <p style={s.cardSub}>Change your name or email address</p>

            {profileMsg.text && (
              <div style={{ ...s.msgBox, ...(profileMsg.type === "success" ? s.msgSuccess : s.msgError) }}>
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={updateProfile} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Full Name</label>
                <input
                  style={s.input} value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email Address</label>
                <input
                  style={s.input} type="email" value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
              </div>
              <button style={s.btn} type="submit">Save Changes</button>
            </form>
          </div>

          {/* Change Password */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Change Password</h3>
            <p style={s.cardSub}>Keep your account secure</p>

            {pwdMsg.text && (
              <div style={{ ...s.msgBox, ...(pwdMsg.type === "success" ? s.msgSuccess : s.msgError) }}>
                {pwdMsg.text}
              </div>
            )}

            <form onSubmit={changePassword} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Current Password</label>
                <input
                  style={s.input} type="password" value={pwd.currentPassword}
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>New Password</label>
                <input
                  style={s.input} type="password" value={pwd.newPassword}
                  onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                  required
                />
              </div>
              <button style={s.btn} type="submit">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: "var(--gray-1)", minHeight: "100vh", padding: "36px 0" },
  container: { maxWidth: "900px", margin: "0 auto", padding: "0 24px" },
  profileHeader: {
    display: "flex", alignItems: "center", gap: "20px",
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    padding: "28px 32px", marginBottom: "24px",
    boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-3)",
  },
  avatarWrap: { flexShrink: 0 },
  avatar: {
    width: "72px", height: "72px", borderRadius: "50%",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "26px", fontWeight: "800",
  },
  headerInfo: { flex: 1 },
  name: { fontSize: "20px", fontWeight: "800", color: "var(--dark)", marginBottom: "4px" },
  username: { fontSize: "14px", color: "var(--text-light)", marginBottom: "2px" },
  email: { fontSize: "13px", color: "var(--gray-4)" },
  roleBadge: {
    padding: "5px 14px", borderRadius: "20px",
    fontSize: "12px", fontWeight: "700",
  },
  adminBadge: { background: "#eff6ff", color: "var(--primary)", border: "1px solid #bfdbfe" },
  userBadge: { background: "var(--gray-2)", color: "var(--gray-5)", border: "1px solid var(--gray-3)" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: {
    background: "var(--white)", borderRadius: "var(--radius-lg)",
    padding: "28px", boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--gray-3)",
  },
  cardTitle: { fontSize: "16px", fontWeight: "800", color: "var(--dark)", marginBottom: "4px" },
  cardSub: { fontSize: "13px", color: "var(--text-light)", marginBottom: "20px" },
  msgBox: {
    padding: "10px 14px", borderRadius: "var(--radius-sm)",
    fontSize: "13px", marginBottom: "16px", fontWeight: "600",
  },
  msgSuccess: { background: "var(--success-light)", color: "var(--success)", border: "1px solid #a7f3d0" },
  msgError: { background: "var(--danger-light)", color: "var(--danger)", border: "1px solid #fecaca" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "var(--gray-6)" },
  input: {
    padding: "11px 14px", border: "1.5px solid var(--gray-3)",
    borderRadius: "var(--radius-sm)", fontSize: "14px",
    outline: "none", color: "var(--text)",
  },
  btn: {
    padding: "12px", background: "var(--primary)",
    color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
    fontWeight: "600", fontSize: "14px", marginTop: "4px",
  },
};
