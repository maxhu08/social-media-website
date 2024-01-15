"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal-store";
import { ExpandedComment } from "~/types";

interface CommentActionsProps {
  comment: ExpandedComment;
  setState: Dispatch<SetStateAction<string>>;
}

export const CommentActions: FC<CommentActionsProps> = ({ comment, setState }) => {
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
          <DropdownMenuItem onClick={() => setState("editing")} className="cursor-pointer">
            <div className="flex place-items-center w-full gap-2">
              <span>edit</span>
              <Trash2 className="w-4 h-4 ml-auto" />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              modal.onOpen("delete-comment", { deleteComment: { commentId: comment.id } })
            }
            className="cursor-pointer">
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
