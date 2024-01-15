import { redirect } from "next/navigation";
import { CreatePostForm } from "~/components/posts/create-post-form";
import { getAuthSession } from "~/lib/auth";

const Page = async () => {
  const session = await getAuthSession();
  if (!session) return redirect("/sign-in");

  return (
    <div>
      <CreatePostForm />
    </div>
  );
};

export default Page;
