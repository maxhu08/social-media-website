import { db } from "~/lib/db";
import { ExpandedComment, ExpandedPost } from "~/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");

    if (!commentId) return new Response("Bad request", { status: 400 });

    const comment: ExpandedComment | null = await db.comment.findFirst({
      where: {
        id: commentId
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    if (!comment) return new Response("Comment could not be found", { status: 400 });

    return Response.json(comment);
  } catch (err) {
    console.log("[POSTS_GET]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
