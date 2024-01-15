import { z } from "zod";
import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";
import { CreateCommentValidator } from "~/lib/validators/comment";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const data = await req.json();
    const { postId, content } = CreateCommentValidator.parse(data);

    const post = await db.post.findFirst({
      where: {
        id: postId
      }
    });

    if (!post) return new Response("Bad request", { status: 400 });

    const comment = await db.comment.create({
      data: {
        postId,
        authorId: session.id,
        content
      }
    });

    return new Response(comment.id);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }

    console.log("[COMMENTS_CREATE]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
