"use client";

import axios from "axios";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { PostComponent } from "~/components/posts/post-component";
import { Context } from "~/context";
import { ExpandedPost, Session } from "~/types";

interface PostsFeedProps {
  session: Session | null;
}

export const PostsFeed: FC<PostsFeedProps> = ({ session }) => {
  const [posts, setPosts] = useState<ExpandedPost[]>([]);
  const [skip, setSkip] = useState(0);
  const [dontFetch, setDontFetch] = useState(false);
  const initialFetchAmount = 5;
  const fetchMoreAmount = 3;
  const lastElementRef = useRef<HTMLDivElement>(null);
  const context = useContext(Context);

  useEffect(() => {
    if (context.value.deletedPost.postId !== null) {
      const updatedPosts = posts.filter(post => post.id !== context.value.deletedPost.postId);

      setPosts(updatedPosts);
      context.setValue({ ...context.value, deletedPost: { postId: null } });
    }
  }, [context.value.deletedPost.postId, context, posts]);

  useEffect(() => {
    const fetchMorePosts = async () => {
      if (dontFetch) return;
      try {
        const initialFetchLink = `/api/posts?sk=${skip}&tk=${initialFetchAmount}`;
        const fetchLink = `/api/posts?sk=${skip + initialFetchAmount - fetchMoreAmount}&tk=${fetchMoreAmount}`;
        const res = await axios.get(skip === 0 ? initialFetchLink : fetchLink);

        const newPosts = res.data;

        if (newPosts.length === 0) {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
          setDontFetch(true);
          return;
        }

        setPosts(prevPosts => [...prevPosts, ...newPosts]);
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
        fetchMorePosts();
      }
    });

    observer.observe(lastEl);

    return () => observer.disconnect();
  }, [dontFetch, skip, posts]);

  return (
    <div>
      <div className="grid grid-flow-row gap-2">
        {posts.map(post => (
          <PostComponent post={post} key={post.id} session={session} isOnFeed={true} />
        ))}
      </div>
      <div className="relative">
        <div ref={lastElementRef} className="absolute z-[-1] w-full h-[400px] mt-[-400px]"></div>
      </div>
    </div>
  );
};
