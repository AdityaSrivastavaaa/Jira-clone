import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Issue } from "../../features/issues/issue.types";
import IssueCard from "./IssueCard";

type Props = {
  title: string;
  issues: Issue[];
};

export default function KanbanColumn({ title, issues }: Props) {
  return (
    <div className="w-72 bg-slate-900 rounded-lg p-3 flex-shrink-0">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>

      <SortableContext
        items={issues.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
