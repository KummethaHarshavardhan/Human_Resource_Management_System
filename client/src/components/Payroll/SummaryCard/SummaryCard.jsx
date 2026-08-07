import React from 'react';
import './SummaryCard.css';

export default function SummaryCard({ title, value, subtitle, icon, variant = 'primary' }) {
  return (
    <div className={`summary-card summary-card-${variant}`}>
      <div className="summary-card-content">
        <span className="summary-card-title">{title}</span>
        <div className="summary-card-value">{value}</div>
        {subtitle && <span className="summary-card-subtitle">{subtitle}</span>}
      </div>
      {icon && <div className="summary-card-icon">{icon}</div>}
    </div>
  );
}
