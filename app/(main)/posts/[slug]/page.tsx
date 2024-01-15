import { CommentsFeed } from "~/components/comments/comments-feed";
import { CreateCommentForm } from "~/components/comments/create-comment-form";
import { PostComponent } from "~/components/posts/post-component";
import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";
import { ExpandedPost } from "~/types";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();

  let post: ExpandedPost | null = await db.post.findFirst({
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

  if (!!session) {
    const existingLike = await db.postLike.findFirst({
      where: {
        authorId: session.id,
        postId: params.slug
      }
    });

    if (existingLike) {
      // @ts-ignore
      post = {
        ...post,
        signedInVote: {
          type: "LIKE"
        }
      };
    }

    const existingDislike = await db.postDislike.findFirst({
      where: {
        authorId: session.id,
        postId: params.slug
      }
    });

    if (existingDislike) {
      // @ts-ignore
      post = {
        ...post,
        signedInVote: {
          type: "DISLIKE"
        }
      };
    }
  }

  if (!post) {
    return (
      <div>
        <p className="text-center p-2">post could not be found or does not exist</p>
      </div>
    );
  }

  return (
    <div>
      <PostComponent post={post} session={session} isOnFeed={false} signedIn={!!session} />
      <p className="text-lg font-semibold p-2">{post._count.comments} comments</p>
      <div className="grid grid-flow-row gap-2">
        <CreateCommentForm postId={params.slug} />
        <CommentsFeed postId={params.slug} session={session} />
      </div>
    </div>
  );
};

export default Page;
