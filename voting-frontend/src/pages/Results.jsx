import { useVoteCounts } from "../hooks/useVotingApp";

export default function Results() {
  const { data: results, isLoading } = useVoteCounts();

  const maxVotes = results ? Math.max(...results.map((r) => r.count), 1) : 1;

  return (
    <div className="page">
      <section className="section">
        <h2>Live Results</h2>
        <p className="section-sub">Vote counts per party, updated in real-time</p>

        {isLoading ? (
          <div className="skeleton-grid">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : results?.length === 0 ? (
          <div className="empty-state">No votes have been cast yet.</div>
        ) : (
          <div className="results-list">
            {[...results]
              .sort((a, b) => b.count - a.count)
              .map((r, i) => (
                <div className="result-row" key={r.party}>
                  <span className="result-rank">#{i + 1}</span>
                  <span className="result-party">{r.party}</span>
                  <div className="result-bar-wrap">
                    <div
                      className="result-bar"
                      style={{ width: `${(r.count / maxVotes) * 100}%` }}
                    />
                  </div>
                  <span className="result-count">{r.count} votes</span>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
