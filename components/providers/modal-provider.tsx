"use client";

import { FC } from "react";
import { DeleteCommentModal } from "~/components/modals/delete-comment-modal";
import { DeletePostModal } from "~/components/modals/delete-post-modal";

export const ModalProvider: FC = () => {
  return (
    <>
      <DeletePostModal />
      <DeleteCommentModal />
    </>
  );
};
