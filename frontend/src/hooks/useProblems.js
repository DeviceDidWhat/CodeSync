import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { problemApi } from "../api/problemApi";

/* -----------------------------
   FETCH ALL PROBLEMS (LIST)
----------------------------- */
export function useProblems() {
  return useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });
}

/* -----------------------------
   FETCH SINGLE PROBLEM (DETAIL)
----------------------------- */
export function useProblem(slug) {
  return useQuery({
    queryKey: ["problem", slug],
    queryFn: () => problemApi.getProblemBySlug(slug),
    enabled: !!slug,
  });
}

/* -----------------------------
   CREATE PROBLEM (POST)
----------------------------- */
export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: problemApi.createProblem,
    onSuccess: () => {
      // 🔥 IMPORTANT: refresh problems list automatically
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}
