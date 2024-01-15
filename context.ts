"use client";

import { createContext, Dispatch, SetStateAction } from "react";

export interface ContextData {
  deletedPost: {
    postId: string | null;
  };
  createdComment: {
    commentId: string | null;
  };
  deletedComment: {
    commentId: string | null;
  };
}

type ContextType = {
  value: ContextData;
  setValue: Dispatch<SetStateAction<ContextData>>;
};

export const defaultContextValue: ContextData = {
  deletedPost: {
    postId: null
  },
  createdComment: {
    commentId: null
  },
  deletedComment: {
    commentId: null
  }
};

export const Context = createContext<ContextType>({
  value: defaultContextValue,
  setValue: () => {}
});
