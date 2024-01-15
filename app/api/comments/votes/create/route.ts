import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("cid");
    const voteType = searchParams.get("type");

    if (!commentId) {
      return new Response("Bad request", { status: 400 });
    }
    if (voteType !== "LIKE" && voteType !== "DISLIKE") {
      return new Response("Bad request", { status: 400 });
    }

    const commentToVoteOn = await db.comment.findFirst({
      where: {
        id: commentId
      }
    });

    if (!commentToVoteOn) {
      return new Response("Comment doesn't exist", { status: 400 });
    }

    const existingLike = await db.commentLike.findFirst({
      where: {
        commentId,
        authorId: session.id
      }
    });

    if (existingLike) return new Response("You already voted this comment", { status: 400 });

    const existingDislike = await db.commentDislike.findFirst({
      where: {
        commentId,
        authorId: session.id
      }
    });

    if (existingDislike) return new Response("You already voted on this comment", { status: 400 });

    if (voteType === "LIKE") {
      await db.commentLike.create({
        data: {
          commentId,
          authorId: session.id
        }
      });
    }

    if (voteType === "DISLIKE") {
      await db.commentDislike.create({
        data: {
          commentId,
          authorId: session.id
        }
      });
    }

    return new Response("ok");
  } catch (err) {
    console.log("[COMMENTS_VOTES_CREATE]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
