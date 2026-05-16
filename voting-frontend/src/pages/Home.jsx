import { useNavigate } from "react-router-dom";
import { useCandidates, useProfile, useCastVote } from "../hooks/useVotingApp";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { data: candidates, isLoading: loadingCandidates } = useCandidates();
  const { data: profileData } = useProfile(isLoggedIn);
  const castVoteMutation = useCastVote();

  const user = profileData?.user;
  const hasVoted = user?.isVoted;
  const isAdmin = user?.role === "admin";

  const handleVote = async (candidateId) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    try {
      await castVoteMutation.mutateAsync(candidateId);
      alert("✅ Vote cast successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Could not cast vote");
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Your Vote.<br />Your Voice.</h1>
        <p>Participate in a fair, transparent election process.</p>
        {!isLoggedIn && (
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate("/login")}>Sign In to Vote</button>
            <button className="btn-outline" onClick={() => navigate("/signup")}>Register</button>
          </div>
        )}
      </section>

      {/* Status banner */}
      {isLoggedIn && user && (
        <div className={`status-banner ${hasVoted ? "voted" : isAdmin ? "admin" : "pending"}`}>
          {isAdmin
            ? `👑 Admin Panel — manage candidates in the Admin section`
            : hasVoted
            ? `✅ You've already cast your vote, ${user.name}`
            : `👋 Hello ${user.name} — you haven't voted yet`}
        </div>
      )}

      {/* Candidates */}
      <section className="section">
        <h2>Candidates</h2>
        {loadingCandidates ? (
          <div className="skeleton-grid">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : (
          <div className="candidate-grid">
            {candidates?.map((c, i) => (
              <div className="candidate-card" key={i}>
                <div className="candidate-avatar">{c.name[0]}</div>
                <h3>{c.name}</h3>
                <span className="party-tag">{c.party}</span>
                {isLoggedIn && !isAdmin && (
                  <button
                    className={`btn-vote ${hasVoted ? "disabled" : ""}`}
                    onClick={() => handleVote(c._id)}
                    disabled={hasVoted || castVoteMutation.isPending}
                  >
                    {hasVoted ? "Voted" : "Cast Vote →"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
