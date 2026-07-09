export default function ServerError({ message }) {
  return (
    <div style={s.box}>
      <div style={s.iconWrap}>
        <span style={s.icon}>!</span>
      </div>
      <div>
        <p style={s.title}>Connection Error</p>
        <p style={s.text}>{message || "Cannot connect to server. Please make sure the backend is running."}</p>
      </div>
    </div>
  );
}

const s = {
  box: {
    display: "flex", alignItems: "flex-start", gap: "14px",
    margin: "0 0 24px", padding: "16px 20px",
    border: "1px solid #fecaca", borderRadius: "var(--radius-sm)",
    background: "var(--danger-light)",
  },
  iconWrap: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "var(--danger)", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  icon: { color: "#fff", fontWeight: "800", fontSize: "16px" },
  title: { fontWeight: "700", color: "#991b1b", fontSize: "14px", marginBottom: "4px" },
  text: { color: "var(--danger)", fontSize: "13px", lineHeight: "1.5" },
};
