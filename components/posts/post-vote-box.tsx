"use client";

import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FC, useState } from "react";
import { cn } from "~/lib/utils";
import { ExpandedPost } from "~/types";

interface PostVoteBoxProps {
  post: ExpandedPost;
  signedIn: boolean;
}

export const PostVoteBox: FC<PostVoteBoxProps> = ({ post, signedIn }) => {
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [dislikeCount, setDislikeCount] = useState(post._count.dislikes);

  const [signedInVoteType, setSignedInVoteType] = useState(post.signedInVote?.type);

  const handleLike = async () => {
    if (!signedIn) return;

    await axios.post(`/api/posts/votes/create?pid=${post.id}&type=${"LIKE"}`);
    setLikeCount((prev) => prev + 1);
    setSignedInVoteType("LIKE");
  };

  const handleDisLike = async () => {
    if (!signedIn) return;

    await axios.post(`/api/posts/votes/create?pid=${post.id}&type=${"DISLIKE"}`);
    setDislikeCount((prev) => prev + 1);
    setSignedInVoteType("DISLIKE");
  };

  return (
    <div className="grid grid-flow-col gap-1 place-items-center">
      <button
        onClick={handleLike}
        className={cn(
          "grid grid-flow-col gap-1 place-items-center border-[1px] hover:bg-black/20 dark:hover:bg-white/20 transition rounded-md px-1",
          signedInVoteType === "LIKE"
            ? "bg-blue-500/20 border-blue-500 hover:!bg-blue-500/40"
            : "border-zinc-400 dark:border-zinc-500"
        )}>
        <ThumbsUp className="w-4 h-4" />
        <span>{likeCount}</span>
      </button>
      <button
        onClick={handleDisLike}
        className={cn(
          "grid grid-flow-col gap-1 place-items-center border-[1px] hover:bg-black/20 dark:hover:bg-white/20 transition rounded-md px-1",
          signedInVoteType === "DISLIKE"
            ? "bg-blue-500/20 border-blue-500 hover:!bg-blue-500/40"
            : "border-zinc-400 dark:border-zinc-500"
        )}>
        <ThumbsDown className="w-4 h-4" />
        <span>{dislikeCount}</span>
      </button>
    </div>
  );
};
