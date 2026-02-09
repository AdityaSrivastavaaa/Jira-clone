import { api } from "../../lib/api";

export async function updateIssue(
  issueId: string,
  data: {
    status?: string;
    position?: number;
  }
) {
  await api.patch(`/issues/${issueId}`, data);
}
