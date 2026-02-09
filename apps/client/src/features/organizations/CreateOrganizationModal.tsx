import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../components/ui/Modal";
import { api } from "../../lib/api";
import { useOrgStore } from "../../store/org.store";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Organization name is required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateOrganizationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { setOrganizations, setCurrentOrg, organizations } =
    useOrgStore();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/orgs", data);

      const newOrg = res.data;

      setOrganizations([newOrg, ...organizations]);
      setCurrentOrg(newOrg);

      toast.success("Organization created");
      reset();
      onClose();
    } catch {
      toast.error("Failed to create organization");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create organization">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Organization name
          </label>
          <input
            {...register("name")}
            placeholder="e.g. Acme Inc"
            className="w-full rounded-md bg-[#020617] border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Create
        </button>
      </form>
    </Modal>
  );
}
