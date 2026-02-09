import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useOrgStore } from "../../store/org.store";

export function useOrganizations() {
  const setOrganizations = useOrgStore((s) => s.setOrganizations);
  const setCurrentOrg = useOrgStore((s) => s.setCurrentOrg);

  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const res = await api.get("/orgs");
      setOrganizations(res.data);
      setCurrentOrg(res.data[0]);
      return res.data;
    },
  });
}
