export default function Attendance() {
  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "20px 24px", borderRadius: "16px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>Attendance</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Track check-ins, absences, and attendance summaries.</p>
        </div>
      </div>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)" }}>
        <h2 style={{ margin: "0 0 8px", color: "#111827" }}>Attendance Overview</h2>
        <p style={{ margin: 0, color: "#6b7280" }}>This section will display your attendance records and daily summaries.</p>
      </div>
    </div>
  );
}
