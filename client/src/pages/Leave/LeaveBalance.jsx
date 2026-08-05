import { useEffect, useState } from "react";
import { getMyLeaveBalance } from "../../services/leaveBalanceService";

export default function LeaveBalance() {
  const [balance, setBalance] = useState({
    annualTotal: 20,
    annualUsed: 0,
    annualRemaining: 20,
    sickTotal: 10,
    sickUsed: 0,
    sickRemaining: 10,
    casualTotal: 6,
    casualUsed: 0,
    casualRemaining: 6,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyLeaveBalance();
      if (res && res.success && res.balance) {
        setBalance(res.balance);
      }
    } catch (err) {
      console.error("Error fetching leave balance:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load leave balance."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const cardsData = [
    {
      id: "annual",
      title: "Annual Leave",
      icon: "🏖️",
      total: balance.annualTotal ?? 20,
      used: balance.annualUsed ?? 0,
      remaining: balance.annualRemaining ?? 20,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
      lightBg: "#eff6ff",
      accentColor: "#3b82f6",
      badgeColor: "#dbeafe",
      badgeText: "#1e40af",
    },
    {
      id: "sick",
      title: "Sick Leave",
      icon: "🤒",
      total: balance.sickTotal ?? 10,
      used: balance.sickUsed ?? 0,
      remaining: balance.sickRemaining ?? 10,
      gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      lightBg: "#ecfdf5",
      accentColor: "#10b981",
      badgeColor: "#d1fae5",
      badgeText: "#065f46",
    },
    {
      id: "casual",
      title: "Casual Leave",
      icon: "☕",
      total: balance.casualTotal ?? 6,
      used: balance.casualUsed ?? 0,
      remaining: balance.casualRemaining ?? 6,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
      lightBg: "#fffbeb",
      accentColor: "#f59e0b",
      badgeColor: "#fef3c7",
      badgeText: "#92400e",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Leave Balance</h2>
          <p style={styles.subtitle}>Overview of your allocated and remaining leave quota</p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchBalance} title="Refresh Leave Balance">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <span>⚠️ {error}</span>
        </div>
      )}

      <div style={styles.grid}>
        {cardsData.map((card) => {
          const total = card.total > 0 ? card.total : 1;
          const percentage = Math.min(
            100,
            Math.max(0, Math.round((card.remaining / total) * 100))
          );

          return (
            <div key={card.id} style={styles.card}>
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconBox, background: card.lightBg }}>
                  <span style={styles.icon}>{card.icon}</span>
                </div>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: card.badgeColor,
                    color: card.badgeText,
                  }}
                >
                  {card.title}
                </span>
              </div>

              {/* Balance Counter */}
              <div style={styles.balanceInfo}>
                <div style={styles.remainingCount}>
                  <span style={styles.hugeNumber}>
                    {loading ? "..." : card.remaining}
                  </span>
                  <span style={styles.totalText}>/ {card.total} Days</span>
                </div>
                <div style={styles.statusLabel}>
                  {card.remaining > 0 ? "Available" : "Exhausted"}
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: loading ? "0%" : `${percentage}%`,
                    background: card.gradient,
                  }}
                />
              </div>

              {/* Card Footer Details */}
              <div style={styles.cardFooter}>
                <div style={styles.footerCol}>
                  <span style={styles.footerLabel}>Used</span>
                  <span style={styles.footerValUsed}>
                    {loading ? "-" : `${card.used} Days`}
                  </span>
                </div>
                <div style={styles.footerDivider} />
                <div style={styles.footerCol}>
                  <span style={styles.footerLabel}>Remaining</span>
                  <span style={{ ...styles.footerValRemaining, color: card.accentColor }}>
                    {loading ? "-" : `${card.remaining} Days`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "30px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
  refreshBtn: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "8px 14px",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
  },
  errorBanner: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "0.875rem",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: "1.3rem",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  balanceInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  remainingCount: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
  },
  hugeNumber: {
    fontSize: "2.4rem",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1,
  },
  totalText: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#94a3b8",
  },
  statusLabel: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#64748b",
    background: "#f8fafc",
    padding: "3px 8px",
    borderRadius: "6px",
  },
  progressTrack: {
    width: "100%",
    height: "10px",
    backgroundColor: "#f1f5f9",
    borderRadius: "20px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "20px",
    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },
  footerCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  footerLabel: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  footerValUsed: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#64748b",
  },
  footerValRemaining: {
    fontSize: "0.95rem",
    fontWeight: "700",
  },
  footerDivider: {
    width: "1px",
    height: "24px",
    backgroundColor: "#e2e8f0",
  },
};
