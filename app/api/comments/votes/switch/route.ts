import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("cid");

    if (!commentId) {
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

    if (existingLike) {
      await db.commentLike.delete({
        where: {
          authorId_commentId: {
            authorId: session.id,
            commentId
          }
        }
      });

      await db.commentDislike.create({
        data: {
          authorId: session.id,
          commentId
        }
      });

      return new Response("ok");
    }

    const existingDislike = await db.commentDislike.findFirst({
      where: {
        commentId,
        authorId: session.id
      }
    });

    if (existingDislike) {
      await db.commentDislike.delete({
        where: {
          authorId_commentId: {
            authorId: session.id,
            commentId
          }
        }
      });

      await db.commentLike.create({
        data: {
          authorId: session.id,
          commentId
        }
      });

      return new Response("ok");
    }

    return new Response("Vote could not be found", { status: 400 });
  } catch (err) {
    console.log("[POSTS_VOTES_DELETE]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
