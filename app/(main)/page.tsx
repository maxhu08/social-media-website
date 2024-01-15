import { Control } from "~/components/control";
import { PostsFeed } from "~/components/posts/posts-feed";
import { getAuthSession } from "~/lib/auth";

const Page = async () => {
  const session = await getAuthSession();

  return (
    <div className="grid grid-flow-row gap-2">
      <Control />
      <PostsFeed session={session} />
    </div>
  );
};

export default Page;
