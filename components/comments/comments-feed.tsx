"use client";

import axios from "axios";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { CommentComponent } from "~/components/comments/comment-component";
import { Context } from "~/context";
import { ExpandedComment, Session } from "~/types";

interface CommentsFeedProps {
  postId: string;
  session: Session | null;
}

export const CommentsFeed: FC<CommentsFeedProps> = ({ postId, session }) => {
  const [comments, setComments] = useState<ExpandedComment[]>([]);
  const [skip, setSkip] = useState(0);
  const [dontFetch, setDontFetch] = useState(false);
  const initialFetchAmount = 5;
  const fetchMoreAmount = 3;
  const lastElementRef = useRef<HTMLDivElement>(null);
  const context = useContext(Context);

  useEffect(() => {
    const fetchUserCreatedComment = async (id: string) => {
      const res = await axios.get(`/api/comments/id/?id=${id}`);

      setComments(prevComments => [res.data, ...prevComments]);
    };

    if (context.value.createdComment.commentId)
      fetchUserCreatedComment(context.value.createdComment.commentId);
  }, [context.value.createdComment.commentId]);

  useEffect(() => {
    if (context.value.deletedComment.commentId !== null) {
      const updatedComments = comments.filter(
        comment => comment.id !== context.value.deletedComment.commentId
      );

      setComments(updatedComments);
      context.setValue({ ...context.value, deletedComment: { commentId: null } });
    }
  }, [context.value.deletedComment.commentId, context, comments]);

  useEffect(() => {
    const fetchMoreComments = async () => {
      if (dontFetch) return;
      try {
        const initialFetchLink = `/api/comments?pid=${postId}&sk=${skip}&tk=${initialFetchAmount}`;
        const fetchLink = `/api/comments?pid=${postId}&sk=${
          skip + initialFetchAmount - fetchMoreAmount
        }&tk=${fetchMoreAmount}`;
        const res = await axios.get(skip === 0 ? initialFetchLink : fetchLink);

        const newComments = res.data;

        if (newComments.length === 0) {
          setComments(prevComments => [...prevComments, ...newComments]);
          setDontFetch(true);
          return;
        }

        setComments(prevComments => [...prevComments, ...newComments]);
        setSkip(prevSkip => prevSkip + fetchMoreAmount);

        setDontFetch(false);
      } catch (err) {
        console.log(err);
      }
    };

    const lastEl = lastElementRef.current;
    if (!lastEl) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreComments();
      }
    });

    observer.observe(lastEl);

    return () => observer.disconnect();
  }, [dontFetch, skip, comments, postId]);

  return (
    <div>
      <div className="grid grid-flow-row gap-2">
        {comments.map(comment => (
          <CommentComponent comment={comment} session={session} key={comment.id} />
        ))}
      </div>
      <div className="relative">
        <div ref={lastElementRef} className="absolute z-[-1] w-full h-[400px] mt-[-400px]"></div>
      </div>
    </div>
  );
};
