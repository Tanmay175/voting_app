import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  const navLink = (to, label) => (
    <Link to={to} className={`nav-link ${pathname === to ? "active" : ""}`}>
      {label}
    </Link>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">🗳️ VoteApp</Link>
      <div className="nav-links">
        {navLink("/", "Home")}
        {navLink("/results", "Results")}
        {isLoggedIn ? (
          <>
            {navLink("/admin", "Admin")}
            {navLink("/profile", "Profile")}
          </>
        ) : (
          <>
            {navLink("/login", "Login")}
            {navLink("/signup", "Register")}
          </>
        )}
      </div>
    </nav>
  );
}
