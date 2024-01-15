import { CommentsFeed } from "~/components/comments/comments-feed";
import { CreateCommentForm } from "~/components/comments/create-comment-form";
import { PostComponent } from "~/components/posts/post-component";
import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();

  const post = await db.post.findFirst({
    where: {
      id: params.slug
    },
    include: {
      author: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          dislikes: true
        }
      }
    }
  });

  if (!post) {
    return (
      <div>
        <p className="text-center p-2">post could not be found or does not exist</p>
      </div>
    );
  }

  return (
    <div>
      <PostComponent post={post} session={session} isOnFeed={false} />
      <p className="text-lg font-semibold p-2">{post._count.comments} comments</p>
      <div className="grid grid-flow-row gap-2">
        <CreateCommentForm postId={params.slug} />
        <CommentsFeed postId={params.slug} session={session} />
      </div>
    </div>
  );
};

export default Page;
