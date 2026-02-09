import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useOrgStore } from "../../store/org.store";
import { useProjectStore } from "../../store/project.store";

export function useProjects() {
  const currentOrg = useOrgStore((s) => s.currentOrg);
  const setProjects = useProjectStore((s) => s.setProjects);

  return useQuery({
    queryKey: ["projects", currentOrg?.id],
    enabled: !!currentOrg,
    queryFn: async () => {
      const res = await api.get(
        `/projects?organizationId=${currentOrg!.id}`
      );
      setProjects(res.data);
      return res.data;
    },
  });
}
