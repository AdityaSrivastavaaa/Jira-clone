import { create } from "zustand";
import { api } from "../lib/api";

export type Project = {
  id: string;
  name: string;
  key: string;
};

type ProjectState = {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  fetchProjects: (orgId: string) => Promise<void>;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProject: null,

  setActiveProject: (project) => set({ activeProject: project }),

  fetchProjects: async (orgId) => {
    const res = await api.get(`/api/v1/projects?organizationId=${orgId}`);
    set({
      projects: res.data,
      activeProject: res.data[0] || null,
    });
  },
}));
