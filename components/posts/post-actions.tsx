"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal-store";
import { ExpandedPost } from "~/types";

interface PostActionsProps {
  post: ExpandedPost;
  isOnFeed: boolean;
}

export const PostActions: FC<PostActionsProps> = ({ post, isOnFeed }) => {
  const modal = useModal();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="hover:bg-black/20 dark:hover:bg-white/20 cursor-pointer transition p-1 rounded-md">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Link href={`/posts/${post.id}/edit`} className="w-full">
              <div className="flex place-items-center w-full gap-2">
                <span>edit</span>
                <Trash2 className="w-4 h-4 ml-auto" />
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => modal.onOpen("delete-post", { deletePost: { postId: post.id, isOnFeed } })} className="cursor-pointer">
            <div className="flex place-items-center w-full gap-2 text-red-500">
              <span>delete</span>
              <Trash2 className="w-4 h-4 ml-auto" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
