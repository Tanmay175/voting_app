import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useVotingApp";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const [form, setForm] = useState({ aadharCardNumber: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginMutation.mutateAsync(form);
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">🗳️</div>
        <h1>Welcome Back</h1>
        <p className="auth-sub">Sign in with your Aadhar credentials</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Aadhar Card Number</label>
            <input
              name="aadharCardNumber"
              value={form.aadharCardNumber}
              onChange={handleChange}
              placeholder="12-digit Aadhar number"
              maxLength={12}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="error-msg">⚠ {error}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
