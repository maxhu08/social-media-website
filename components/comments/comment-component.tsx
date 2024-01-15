"use client";

import Link from "next/link";
import { FC, useState } from "react";
import { CommentActions } from "~/components/comments/comment-actions";
import { EditCommentForm } from "~/components/comments/edit-comment-form";
import { formatDateAgo } from "~/lib/utils";
import { ExpandedComment, Session } from "~/types";

interface CommentComponentProps {
  comment: ExpandedComment;
  session: Session | null;
}

export const CommentComponent: FC<CommentComponentProps> = ({ comment, session }) => {
  const [state, setState] = useState("viewing");
  const [commentContent, setCommentContent] = useState(comment.content);

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-2 sm:rounded-md overflow-auto">
      {state === "viewing" && (
        <div className="grid grid-flow-row gap-1">
          <div className="grid grid-flow-col">
            <div className="grid grid-cols-[repeat(4,max-content)] gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              <Link href={`/profile/${comment.authorId}`}>{comment.author.name}</Link>
              <span>•</span>
              <span>{formatDateAgo(comment.createdAt.toString())}</span>
              {comment.createdAt !== comment.updatedAt && <span>(edited)</span>}
            </div>
            {comment.authorId === session?.id && (
              <div className="ml-auto">
                <CommentActions comment={comment} setState={setState} />
              </div>
            )}
          </div>
          <p className="overflow-hidden break-words whitespace-pre-wrap">{commentContent}</p>
        </div>
      )}
      {state === "editing" && (
        <EditCommentForm
          commentId={comment.id}
          defaultValues={{
            content: commentContent
          }}
          setState={setState}
          setCommentContent={setCommentContent}
        />
      )}
    </div>
  );
};
