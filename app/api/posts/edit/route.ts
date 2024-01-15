import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";
import { EditPostValidator } from "~/lib/validators/post";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const data = await req.json();
    const { title, content, id } = EditPostValidator.parse(data);

    const postToEdit = await db.post.findFirst({
      where: {
        id
      },
      select: {
        authorId: true
      }
    });

    if (!postToEdit) return new Response("Bad request", { status: 400 });
    if (postToEdit.authorId !== session.id) return new Response("Unauthorized", { status: 401 });

    await db.post.update({
      where: {
        id
      },
      data: {
        title,
        content
      }
    });

    return new Response("ok");
  } catch (err) {
    console.log("[POSTS_EDIT]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
