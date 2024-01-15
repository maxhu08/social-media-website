import { redirect } from "next/navigation";
import { EditPostForm } from "~/components/posts/edit-post-form";
import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();
  if (!session) return redirect("/");

  const postToEdit = await db.post.findFirst({
    where: {
      id: params.slug
    },
    select: {
      authorId: true,
      title: true,
      content: true
    }
  });

  if (!postToEdit) return redirect("/");
  if (postToEdit.authorId !== session.id) return redirect("/");

  return (
    <div>
      <EditPostForm
        postId={params.slug}
        defaultValues={{
          title: postToEdit.title,
          content: postToEdit.content
        }}
      />
    </div>
  );
};

export default Page;
