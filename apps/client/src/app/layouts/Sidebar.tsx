import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#020617] border-r border-slate-800 p-4 flex flex-col">
      <div className="mb-6 text-lg font-semibold tracking-wide">
        Jira Clone
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        <button
          onClick={() => navigate("/")}
          className="text-left px-3 py-2 rounded hover:bg-slate-800"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/projects/demo")}
          className="text-left px-3 py-2 rounded hover:bg-slate-800"
        >
          Project Board
        </button>
      </nav>

      <div className="mt-auto text-xs text-slate-500">
        © Jira Clone
      </div>
    </aside>
  );
}
