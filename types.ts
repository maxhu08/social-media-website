import { Comment, Post } from "@prisma/client";

export type Session = {
  id: string;
  email: string;
  name: string;
};

export type ExpandedPost = Post & {
  author: {
    name: string;
  };
  _count: {
    comments: number;
    likes: number;
    dislikes: number;
  };
  signedInVote?: {
    type: "LIKE" | "DISLIKE";
  };
};

export type ExpandedComment = Comment & {
  author: {
    name: string;
  };
  _count: {
    likes: number;
    dislikes: number;
  };
  signedInVote?: {
    type: "LIKE" | "DISLIKE";
  };
};
