import { useParams } from "react-router-dom";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useIssues } from "./useIssues";
import KanbanColumn from "../../components/kanban/KanbanColumn";
import type { IssueStatus } from "./issue.types";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { updateIssue } from "./issue.api";

const columns: IssueStatus[] = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
];
const queryClient = useQueryClient();
export default function ProjectBoard() {
  const { projectId } = useParams();
  const { data: issues = [] } = useIssues(projectId!);

  const grouped = columns.reduce((acc, status) => {
    acc[status] = issues
      .filter((i) => i.status === status)
      .sort((a, b) => a.position - b.position);
    return acc;
  }, {} as Record<IssueStatus, typeof issues>);

  const onDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const activeIssue = issues.find((i) => i.id === active.id);
  const overIssue = issues.find((i) => i.id === over.id);

  if (!activeIssue || !overIssue) return;

  // CASE 1: SAME COLUMN
  if (activeIssue.status === overIssue.status) {
    const sameColumn = issues
      .filter((i) => i.status === activeIssue.status)
      .sort((a, b) => a.position - b.position);

    const oldIndex = sameColumn.findIndex((i) => i.id === activeIssue.id);
    const newIndex = sameColumn.findIndex((i) => i.id === overIssue.id);

    const reordered = arrayMove(sameColumn, oldIndex, newIndex);

    await Promise.all(
      reordered.map((issue, index) =>
        updateIssue(issue.id, { position: index })
      )
    );
  }

  // CASE 2: MOVE TO DIFFERENT COLUMN
  else {
    await updateIssue(activeIssue.id, {
      status: overIssue.status,
      position: overIssue.position,
    });
  }

  // REFRESH DATA
  queryClient.invalidateQueries({
    queryKey: ["issues", projectId],
  });
};

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            title={status.replace("_", " ")}
            issues={grouped[status]}
          />
        ))}
      </div>
    </DndContext>
  );
}
