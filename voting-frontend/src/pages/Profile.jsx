import { useState } from "react";
import { useProfile, useChangePassword } from "../hooks/useVotingApp";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();
  const changePasswordMutation = useChangePassword();

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");

  const user = profileData?.user;

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await changePasswordMutation.mutateAsync(pwForm);
      setMsg("✅ Password updated successfully!");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Failed to update password"));
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  if (isLoading) return <div className="page"><div className="loading-spinner" /></div>;

  return (
    <div className="page">
      <section className="section">
        <h2>My Profile</h2>

        {user && (
          <div className="profile-card">
            <div className="profile-avatar">{user.name?.[0]}</div>
            <div className="profile-info">
              <div className="profile-field"><span>Name</span><strong>{user.name}</strong></div>
              <div className="profile-field"><span>Age</span><strong>{user.age}</strong></div>
              <div className="profile-field"><span>Email</span><strong>{user.email || "—"}</strong></div>
              <div className="profile-field"><span>Mobile</span><strong>{user.mobile || "—"}</strong></div>
              <div className="profile-field"><span>Address</span><strong>{user.address}</strong></div>
              <div className="profile-field"><span>Role</span><strong className={`role-badge ${user.role}`}>{user.role}</strong></div>
              <div className="profile-field">
                <span>Voted</span>
                <strong>{user.isVoted ? "✅ Yes" : "⏳ Not yet"}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="section-divider" />

        <h3>Change Password</h3>
        <form className="pw-form" onSubmit={handlePwSubmit}>
          <div className="field">
            <label>Current Password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label>New Password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
              required
            />
          </div>
          {msg && <p className={msg.startsWith("✅") ? "success-msg" : "error-msg"}>{msg}</p>}
          <button type="submit" className="btn-primary" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? "Updating…" : "Update Password"}
          </button>
        </form>

        <div className="section-divider" />
        <button className="btn-danger" onClick={handleLogout}>Sign Out</button>
      </section>
    </div>
  );
}
