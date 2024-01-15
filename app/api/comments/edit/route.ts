import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";
import { EditCommentValidator } from "~/lib/validators/comment";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const data = await req.json();
    const { id, content } = EditCommentValidator.parse(data);

    const commentToEdit = await db.comment.findFirst({
      where: {
        id
      },
      select: {
        authorId: true
      }
    });

    if (!commentToEdit) return new Response("Bad request", { status: 400 });
    if (commentToEdit.authorId !== session.id) return new Response("Unauthorized", { status: 401 });

    await db.comment.update({
      where: {
        id
      },
      data: {
        content
      }
    });

    return new Response("ok");
  } catch (err) {
    console.log("[COMMENTS_EDIT]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
