import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Issue } from "../../features/issues/issue.types";

export default function IssueCard({ issue }: { issue: Issue }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-[#020617] border border-slate-800 rounded p-3 text-sm cursor-grab"
    >
      <p className="font-medium">{issue.title}</p>
      <p className="text-xs text-slate-400 mt-1">
        {issue.assignee?.name || "Unassigned"}
      </p>
    </div>
  );
}
