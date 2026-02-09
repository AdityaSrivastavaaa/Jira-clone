import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { useOrgStore } from "../../store/org.store";
import CreateOrganizationModal from "../../features/organizations/CreateOrganizationModal";

export default function Topbar() {
  const { currentOrg } = useOrgStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#020617]">
        {/* Org Switcher */}
        <div
          className="flex items-center gap-2 text-sm text-slate-100 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="font-semibold">
            {currentOrg?.name || "Select organization"}
          </span>
          <ChevronDown size={14} />
        </div>

        {/* User placeholder */}
        <div className="text-sm text-slate-300">Profile</div>
      </header>

      <CreateOrganizationModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
