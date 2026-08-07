import React from 'react';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search by Employee Code or Name...' }) {
  return (
    <div className="payroll-search-bar">
      <span className="search-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear-btn" onClick={() => onChange('')} title="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
