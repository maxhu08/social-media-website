import { getAuthSession } from "~/lib/auth";
import { db } from "~/lib/db";
import { ExpandedPost } from "~/types";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const signedIn = !!session;

    const { searchParams } = new URL(req.url);
    const skipAmount = searchParams.get("sk");
    const takeAmount = searchParams.get("tk");

    if (!skipAmount || !takeAmount) return new Response("Bad request", { status: 400 });

    const skipNum = parseInt(skipAmount);
    const takeNum = parseInt(takeAmount);

    if (takeNum >= 10) return new Response("Bad request", { status: 400 });

    const posts: ExpandedPost[] = await db.post.findMany({
      skip: skipNum,
      take: takeNum,
      orderBy: {
        createdAt: "desc"
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

    if (signedIn) {
      const postsWithSignedInVoteData = await Promise.all(
        posts.map(async (post) => {
          const existingLike = await db.postLike.findFirst({
            where: {
              authorId: session.id,
              postId: post.id
            }
          });

          if (existingLike) {
            return {
              ...post,
              signedInVote: {
                type: "LIKE"
              }
            };
          }

          const existingDislike = await db.postDislike.findFirst({
            where: {
              authorId: session.id,
              postId: post.id
            }
          });

          if (existingDislike) {
            return {
              ...post,
              signedInVote: {
                type: "DISLIKE"
              }
            };
          }

          return post;
        })
      );

      return Response.json(postsWithSignedInVoteData);
    } else return Response.json(posts);
  } catch (err) {
    console.log("[POSTS_GET]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
