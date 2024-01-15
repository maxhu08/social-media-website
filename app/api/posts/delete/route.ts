import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) return new Response("Bad requeset", { status: 400 });

    const postToDelete = await db.post.findFirst({
      where: {
        id: postId
      },
      select: {
        authorId: true
      }
    });

    if (!postToDelete) return new Response("Bad requeset", { status: 400 });
    if (postToDelete.authorId !== session.id) return new Response("Unauthorized", { status: 401 });

    await db.post.delete({
      where: {
        id: postId
      }
    });

    return new Response("ok");
  } catch (err) {
    console.log("[POSTS_DELETE]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
