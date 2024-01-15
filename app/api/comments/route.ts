import { db } from "~/lib/db";
import { ExpandedComment } from "~/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("pid");
    const skipAmount = searchParams.get("sk");
    const takeAmount = searchParams.get("tk");

    if (!postId) return new Response("Bad request", { status: 400 });
    if (!skipAmount || !takeAmount) return new Response("Bad request", { status: 400 });

    const skipNum = parseInt(skipAmount);
    const takeNum = parseInt(takeAmount);

    if (takeNum >= 10) return new Response("Bad request", { status: 400 });

    const post = await db.post.findFirst({
      where: {
        id: postId
      }
    });

    if (!post) return new Response("Post does not exist", { status: 400 });

    const comments: ExpandedComment[] = await db.comment.findMany({
      where: {
        postId
      },
      skip: skipNum,
      take: takeNum,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return Response.json(comments);
  } catch (err) {
    console.log("[COMMENTS_GET]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
