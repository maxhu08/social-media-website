import { z } from "zod";

export const CreatePostValidator = z.object({
  title: z.string().min(1, { message: "title is required" }).max(100, { message: "title must be under 100 chars" }),
  content: z.string().max(1000, { message: "content must be under 1000 chars" })
});

export const EditPostValidator = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "title is required" }).max(100, { message: "title must be under 100 chars" }),
  content: z.string().max(1000, { message: "content must be under 1000 chars" })
});
