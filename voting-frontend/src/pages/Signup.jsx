import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignup } from "../hooks/useVotingApp";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const signupMutation = useSignup();

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    aadharCardNumber: "",
    password: "",
    role: "voter",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await signupMutation.mutateAsync({
        ...form,
        age: Number(form.age),
        aadharCardNumber: Number(form.aadharCardNumber),
      });
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-badge">📋</div>
        <h1>Register to Vote</h1>
        <p className="auth-sub">Create your voter account</p>

        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
            </div>
            <div className="field">
              <label>Age *</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Your age" min={18} required />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Optional" />
            </div>
            <div className="field">
              <label>Mobile</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Optional" />
            </div>
          </div>

          <div className="field">
            <label>Address *</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Your full address" required />
          </div>

          <div className="field">
            <label>Aadhar Card Number *</label>
            <input
              name="aadharCardNumber"
              value={form.aadharCardNumber}
              onChange={handleChange}
              placeholder="12-digit number"
              maxLength={12}
              required
            />
          </div>

          <div className="field">
            <label>Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Choose a strong password" required />
          </div>

          <div className="field">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="voter">Voter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="error-msg">⚠ {error}</p>}

          <button type="submit" className="btn-primary" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
