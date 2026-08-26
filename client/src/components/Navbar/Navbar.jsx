import React from 'react';
import { FiX } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search by Employee Code or Name...' }) {
  return (
    <div className="payroll-search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => onChange('')}
          title="Clear search"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
}