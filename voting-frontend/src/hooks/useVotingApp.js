import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidates,
  getVoteCounts,
  getProfile,
  loginUser,
  signupUser,
  changePassword,
  castVote,
  addCandidate,
  updateCandidate,
  deleteCandidate,
} from "../api";

// ─── Query Keys (centralized so they're consistent) ───────────
export const QUERY_KEYS = {
  candidates: ["candidates"],
  voteCounts: ["voteCounts"],
  profile: ["profile"],
};

// ─── useQuery Hooks (fetching data) ───────────────────────────

// Fetch all candidates (public)
export const useCandidates = () =>
  useQuery({
    queryKey: QUERY_KEYS.candidates,
    queryFn: getCandidates,
  });

// Fetch vote counts (public leaderboard)
export const useVoteCounts = () =>
  useQuery({
    queryKey: QUERY_KEYS.voteCounts,
    queryFn: getVoteCounts,
  });

// Fetch logged-in user's profile (requires token in localStorage)
export const useProfile = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getProfile,
    enabled, // Only runs when enabled=true (i.e., user is logged in)
  });

// ─── useMutation Hooks (actions that change data) ─────────────

export const useSignup = () =>
  useMutation({ mutationFn: signupUser });

export const useLogin = () =>
  useMutation({ mutationFn: loginUser });

export const useChangePassword = () =>
  useMutation({ mutationFn: changePassword });

export const useCastVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: castVote,
    onSuccess: () => {
      // After voting, refetch vote counts + profile (isVoted changes)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.voteCounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });
};

export const useAddCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCandidate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidates }),
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCandidate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidates }),
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidates }),
  });
};
