import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("pid");
    const voteType = searchParams.get("type");

    if (!postId) {
      return new Response("Bad request", { status: 400 });
    }
    if (voteType !== "LIKE" && voteType !== "DISLIKE") {
      return new Response("Bad request", { status: 400 });
    }

    const postToVoteOn = await db.post.findFirst({
      where: {
        id: postId
      }
    });

    if (!postToVoteOn) {
      return new Response("Post doesn't exist", { status: 400 });
    }

    const existingLike = await db.postLike.findFirst({
      where: {
        postId,
        authorId: session.id
      }
    });

    if (existingLike) return new Response("You already voted this post", { status: 400 });

    const existingDislike = await db.postDislike.findFirst({
      where: {
        postId,
        authorId: session.id
      }
    });

    if (existingDislike) return new Response("You already voted on this post", { status: 400 });

    if (voteType === "LIKE") {
      await db.postLike.create({
        data: {
          postId,
          authorId: session.id
        }
      });
    }

    if (voteType === "DISLIKE") {
      await db.postDislike.create({
        data: {
          postId,
          authorId: session.id
        }
      });
    }

    return new Response("ok");
  } catch (err) {
    console.log("[POSTS_VOTES_CREATE]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
