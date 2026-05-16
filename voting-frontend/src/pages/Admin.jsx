import { useState } from "react";
import {
  useCandidates,
  useAddCandidate,
  useDeleteCandidate,
  useProfile,
} from "../hooks/useVotingApp";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { data: profileData } = useProfile(isLoggedIn);
  const { data: candidates, isLoading } = useCandidates();
  const addMutation = useAddCandidate();
  const deleteMutation = useDeleteCandidate();

  const [form, setForm] = useState({ name: "", age: "", party: "" });
  const [msg, setMsg] = useState("");

  const isAdmin = profileData?.user?.role === "admin";

  if (!isLoggedIn) return (
    <div className="page">
      <div className="empty-state">
        <p>You must be logged in.</p>
        <button className="btn-primary" onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="page">
      <div className="empty-state">🚫 Admins only.</div>
    </div>
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await addMutation.mutateAsync({ ...form, age: Number(form.age) });
      setMsg("✅ Candidate added!");
      setForm({ name: "", age: "", party: "" });
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Failed"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      alert("Could not delete candidate");
    }
  };

  return (
    <div className="page">
      <section className="section">
        <h2>Admin Panel</h2>
        <p className="section-sub">Manage election candidates</p>

        <h3>Add Candidate</h3>
        <form className="pw-form" onSubmit={handleAdd}>
          <div className="field-row">
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="field">
              <label>Age</label>
              <input type="number" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} required />
            </div>
          </div>
          <div className="field">
            <label>Party</label>
            <input value={form.party} onChange={(e) => setForm((f) => ({ ...f, party: e.target.value }))} required />
          </div>
          {msg && <p className={msg.startsWith("✅") ? "success-msg" : "error-msg"}>{msg}</p>}
          <button type="submit" className="btn-primary" disabled={addMutation.isPending}>
            {addMutation.isPending ? "Adding…" : "Add Candidate"}
          </button>
        </form>

        <div className="section-divider" />
        <h3>All Candidates</h3>

        {isLoading ? <div className="loading-spinner" /> : (
          <div className="admin-table">
            {candidates?.length === 0 && <p className="empty-state">No candidates yet.</p>}
            {candidates?.map((c, i) => (
              <div className="admin-row" key={i}>
                <div>
                  <strong>{c.name}</strong>
                  <span className="party-tag">{c.party}</span>
                </div>
                <button
                  className="btn-danger-sm"
                  onClick={() => handleDelete(c._id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
