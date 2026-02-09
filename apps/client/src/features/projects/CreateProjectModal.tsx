import Modal from "../../components/ui/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/api";
import { useOrgStore } from "../../store/org.store";
import { useProjectStore } from "../../store/project.store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Project name is required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { currentOrg } = useOrgStore();
  const { addProject } = useProjectStore();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!currentOrg) return null;

  const onSubmit = async (data: FormData) => {
    try {
      const key = data.name
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 5)
        .toUpperCase();

      const res = await api.post("/projects", {
        name: data.name,
        key,
        organizationId: currentOrg.id,
      });

      addProject(res.data);

      toast.success("Project created");
      reset();
      onClose();
      navigate(`/projects/${res.data.id}`);
    } catch {
      toast.error("Failed to create project");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create project">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Project name
          </label>
          <input
            {...register("name")}
            placeholder="e.g. Jira Clone"
            className="w-full rounded-md bg-[#020617] border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Create project
        </button>
      </form>
    </Modal>
  );
}
