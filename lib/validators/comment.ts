import { z } from "zod";

export const CreateCommentValidator = z.object({
  postId: z.string(),
  content: z.string().min(1).max(1000, { message: "content must be under 1000 chars" })
});

export const EditCommentValidator = z.object({
  id: z.string(),
  content: z.string().min(1).max(1000, { message: "content must be under 1000 chars" })
});
