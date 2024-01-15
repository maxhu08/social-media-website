"use client";

import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FC, useState } from "react";
import { ExpandedPost } from "~/types";

interface PostVoteBoxProps {
  post: ExpandedPost;
}

export const PostVoteBox: FC<PostVoteBoxProps> = ({ post }) => {
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [dislikeCount, setDislikeCount] = useState(post._count.dislikes);

  const handleLike = async () => {
    await axios.post(`/api/posts/votes/create?pid=${post.id}&type=${"LIKE"}`);
    setLikeCount((prev) => prev + 1);
  };

  const handleDisLike = async () => {
    await axios.post(`/api/posts/votes/create?pid=${post.id}&type=${"DISLIKE"}`);
    setDislikeCount((prev) => prev + 1);
  };

  return (
    <div className="grid grid-flow-col gap-1 place-items-center">
      <button
        onClick={handleLike}
        className="grid grid-flow-col gap-1 place-items-center border-[1px] hover:bg-black/20 dark:hover:bg-white/20 transition border-zinc-400 dark:border-zinc-500 rounded-md px-1">
        <ThumbsUp className="w-4 h-4" />
        <span>{likeCount}</span>
      </button>
      <button className="grid grid-flow-col gap-1 place-items-center border-[1px] hover:bg-black/20 dark:hover:bg-white/20 transition border-zinc-400 dark:border-zinc-500 rounded-md px-1">
        <ThumbsDown className="w-4 h-4" />
        <span>{dislikeCount}</span>
      </button>
    </div>
  );
};
