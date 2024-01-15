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

export const DeletePostModal: FC = () => {
  const modal = useModal();
  const isModalOpen = modal.isOpen && modal.type === "delete-post";
  const router = useRouter();

  const context = useContext(Context);

  const handleDelete = async () => {
    const pid = modal.data.deletePost?.postId;

    if (typeof pid === "undefined") return;
    await axios.delete(`/api/posts/delete?id=${pid}`);

    modal.onClose();

    if (!modal.data.deletePost?.isOnFeed) {
      router.push("/");
      return;
    }
    context.setValue({
      ...context.value,
      deletedPost: {
        postId: pid
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={modal.onClose}>
      <DialogContent className="sm:w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">delete post</DialogTitle>
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
