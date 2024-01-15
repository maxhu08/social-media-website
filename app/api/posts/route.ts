import { db } from "~/lib/db";
import { ExpandedPost } from "~/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skipAmount = searchParams.get("sk");
    const takeAmount = searchParams.get("tk");

    if (!skipAmount || !takeAmount) return new Response("Bad request", { status: 400 });

    const skipNum = parseInt(skipAmount);
    const takeNum = parseInt(takeAmount);

    if (takeNum >= 10) return new Response("Bad request", { status: 400 });

    const posts: ExpandedPost[] = await db.post.findMany({
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
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            dislikes: true
          }
        }
      }
    });

    return Response.json(posts);
  } catch (err) {
    console.log("[POSTS_GET]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
