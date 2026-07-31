import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-title">Infinetra HRMS</div>
        <nav className="navbar-links">
          <a href="/dashboard">Directory</a>
          <a href="/dashboard">Benefits</a>
          <a href="/dashboard">Policies</a>
        </nav>
      </div>
      <div className="navbar-right">
        <div className="navbar-controls">
          
        </div>
      </div>
    </header>
  );
}
