import { z } from "zod";
import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";
import { CreatePostValidator } from "~/lib/validators/post";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const data = await req.json();
    const { title, content } = CreatePostValidator.parse(data);

    const post = await db.post.create({
      data: {
        authorId: session.id,
        title,
        content
      }
    });

    return new Response(post.id);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }

    console.log("[POSTS_CREATE]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
