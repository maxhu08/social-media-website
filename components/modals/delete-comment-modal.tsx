"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useContext } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { Context } from "~/context";
import { useModal } from "~/hooks/use-modal-store";

export const DeleteCommentModal: FC = () => {
  const modal = useModal();
  const isModalOpen = modal.isOpen && modal.type === "delete-comment";
  const router = useRouter();

  const context = useContext(Context);

  const handleDelete = async () => {
    const cid = modal.data.deleteComment?.commentId;
    if (typeof cid === "undefined") return;
    await axios.delete(`/api/comments/delete?id=${cid}`);

    modal.onClose();

    context.setValue({
      ...context.value,
      deletedComment: {
        commentId: cid
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={modal.onClose}>
      <DialogContent className="sm:w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">delete comment</DialogTitle>
          <DialogDescription className="text-center">
            this action cannot be undone
          </DialogDescription>
        </DialogHeader>
        <div className="grid place-items-center">
          <Button onClick={handleDelete}>delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
