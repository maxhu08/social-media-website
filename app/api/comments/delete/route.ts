import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");

    if (!commentId) return new Response("Bad request", { status: 400 });

    const commentToDelete = await db.comment.findFirst({
      where: {
        id: commentId
      },
      select: {
        authorId: true
      }
    });

    if (!commentToDelete) return new Response("Bad request", { status: 400 });
    if (commentToDelete.authorId !== session.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.delete({
      where: {
        id: commentId
      }
    });

    return new Response("ok");
  } catch (err) {
    console.log("[COMMENTS_DELETE]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
