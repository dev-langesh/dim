import { z } from "zod";

export const projectInfoSchema = z.object({
  app_name: z.string().min(1, "Project name is required"),
  git_branch: z.string().min(1, "Git branch is required"),
  platform: z.string().min(1, "Platform is required"),
});
