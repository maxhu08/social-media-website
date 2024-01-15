import { UserPostsFeed } from "~/components/posts/user-posts-feed";
import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";
import { formatDateAgo } from "~/lib/utils";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: params.slug
    },
    select: {
      name: true,
      createdAt: true,
      _count: {
        select: {
          posts: true
        }
      }
    }
  });

  if (!user) {
    return <div className="text-center">this profile doesn&apos;t exist or cannot be found</div>;
  }

  return (
    <div className="grid grid-flow-row gap-2">
      <div className="p-2 sm:p-0 grid grid-flow-row gap-2">
        <p className="font-semibold">{user.name}</p>
        <span>joined {formatDateAgo(user.createdAt.toString())}</span>
        <span>
          {user._count.posts} post{user._count.posts === 1 ? "" : "s"}
        </span>
      </div>
      <UserPostsFeed userId={params.slug} session={session} />
    </div>
  );
};

export default Page;
