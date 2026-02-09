export type IssueStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DONE";

export type Issue = {
  id: string;
  title: string;
  status: IssueStatus;
  position: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignee?: {
    id: string;
    name?: string;
  };
};
