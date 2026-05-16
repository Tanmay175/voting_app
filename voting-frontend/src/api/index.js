import axios from "axios";

// ─── Base Setup ──────────────────────────────────────────────
// TODO: When you connect the backend, replace this with your actual base URL
const BASE_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── User API ─────────────────────────────────────────────────

// POST /user/signup
export const signupUser = async (userData) => {
  const { data } = await api.post("/user/signup", userData);
  return data; // { response: user, token: "..." }
};

// POST /user/login
export const loginUser = async ({ aadharCardNumber, password }) => {
  const { data } = await api.post("/user/login", { aadharCardNumber, password });
  return data; // { token: "..." }
};

// GET /user/profile
export const getProfile = async () => {
  const { data } = await api.get("/user/profile");
  return data; // { user: { name, age, role, isVoted, ... } }
};

// PUT /user/profile/password
export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await api.put("/user/profile/password", { currentPassword, newPassword });
  return data; // { message: "Password updated" }
};

// ─── Candidate API ────────────────────────────────────────────

// GET /candidate  (public - name and party only)
export const getCandidates = async () => {
  const { data } = await api.get("/candidate");
  return data; // [{ name, party }, ...]
};

// GET /candidate/vote/count  (public - vote counts per party)
export const getVoteCounts = async () => {
  const { data } = await api.get("/candidate/vote/count");
  return data; // [{ party, count }, ...]
};

// GET /candidate/vote/:candidateID  (cast a vote — requires auth)
export const castVote = async (candidateID) => {
  const { data } = await api.get(`/candidate/vote/${candidateID}`);
  return data; // { message: "Vote recorded successfully" }
};

// POST /candidate  (admin only)
export const addCandidate = async (candidateData) => {
  const { data } = await api.post("/candidate", candidateData);
  return data;
};

// PUT /candidate/:candidateID  (admin only)
export const updateCandidate = async ({ candidateID, ...candidateData }) => {
  const { data } = await api.put(`/candidate/${candidateID}`, candidateData);
  return data;
};

// DELETE /candidate/:candidateID  (admin only)
export const deleteCandidate = async (candidateID) => {
  const { data } = await api.delete(`/candidate/${candidateID}`);
  return data;
};
