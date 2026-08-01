import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <strong>Infinetra HRMS</strong>
          <small>People & Payroll</small>
        </div>

        <nav className="navbar-links">
          <a href="/dashboard" className="active">Directory</a>
          <a href="/dashboard">Benefits</a>
          <a href="/dashboard">Policies</a>
        </nav>
      </div>
    </header>
  );
}
