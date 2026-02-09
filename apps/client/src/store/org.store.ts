import { create } from "zustand";
import { api } from "../lib/api";

export type Organization = {
  id: string;
  name: string;
};

type OrgState = {
  orgs: Organization[];
  activeOrg: Organization | null;
  setActiveOrg: (org: Organization) => void;
  fetchOrgs: () => Promise<void>;
};

export const useOrgStore = create<OrgState>((set) => ({
  orgs: [],
  activeOrg: null,

  setActiveOrg: (org) => set({ activeOrg: org }),

  fetchOrgs: async () => {
    const res = await api.get("/api/v1/orgs");
    set({
      orgs: res.data,
      activeOrg: res.data[0] || null, // auto-select first
    });
  },
}));
