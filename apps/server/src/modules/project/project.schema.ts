import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3),
  key: z.string().min(2).max(10).toUpperCase(),
  organizationId: z.string().uuid(),
});
