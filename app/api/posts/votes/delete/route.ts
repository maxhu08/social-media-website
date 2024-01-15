import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("pid");

    if (!postId) {
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

    if (existingLike) {
      await db.postLike.delete({
        where: {
          authorId_postId: {
            authorId: session.id,
            postId
          }
        }
      });

      return new Response("ok");
    }

    const existingDislike = await db.postDislike.findFirst({
      where: {
        postId,
        authorId: session.id
      }
    });

    if (existingDislike) {
      await db.postDislike.delete({
        where: {
          authorId_postId: {
            authorId: session.id,
            postId
          }
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
