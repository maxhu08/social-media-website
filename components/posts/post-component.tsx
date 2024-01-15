import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { PostActions } from "~/components/posts/post-actions";
import { PostVoteBox } from "~/components/posts/post-vote-box";
import { formatDateAgo } from "~/lib/utils";
import { ExpandedPost, Session } from "~/types";

interface PostComponentProps {
  post: ExpandedPost;
  isOnFeed: boolean;
  session: Session | null;
}

export const PostComponent: FC<PostComponentProps> = ({ post, isOnFeed, session }) => {
  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-2 sm:rounded-md overflow-auto">
      <div className="grid grid-flow-row gap-1">
        <div className="grid grid-flow-col">
          <div className="grid grid-cols-[repeat(4,max-content)] gap-1 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href={`/profile/${post.authorId}`}>{post.author.name}</Link>
            <span>•</span>
            <span>{formatDateAgo(post.createdAt.toString())}</span>
            {post.createdAt !== post.updatedAt && <span>(edited)</span>}
          </div>
          {post.authorId === session?.id && (
            <div className="ml-auto">
              <PostActions post={post} isOnFeed={isOnFeed} />
            </div>
          )}
        </div>
        <Link href={`/posts/${post.id}`}>
          <p className="font-semibold overflow-hidden break-words whitespace-pre-wrap">
            {post.title}
          </p>
        </Link>
        {post.content !== "" && (
          <p className="overflow-hidden break-words whitespace-pre-wrap">{post.content}</p>
        )}
      </div>
      <div className="grid grid-flow-col w-max gap-1 place-items-center">
        <PostVoteBox post={post} />
        <div>
          <div className="w-max">
            {isOnFeed && (
              <Link href={`/posts/${post.id}`} className="w-full">
                <div className="grid grid-flow-col gap-1 place-items-center border-[1px] hover:bg-black/20 dark:hover:bg-white/20 transition border-zinc-400 dark:border-zinc-500 rounded-md px-1">
                  <MessagesSquare className="w-4 h-4" />
                  <span>{post._count.comments}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
