import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Issue } from "./issue.types";

export function useIssues(projectId: string) {
  return useQuery<Issue[]>({
    queryKey: ["issues", projectId],
    queryFn: async () => {
      const res = await api.get(`/issues?projectId=${projectId}`);
      return res.data;
    },
  });
}
