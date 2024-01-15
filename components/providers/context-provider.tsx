"use client";

import { FC, useState } from "react";
import { Context, ContextData } from "~/context";

interface ContextProviderProps {
  initialValue: ContextData;
  children: React.ReactNode;
}

export const ContextProvider: FC<ContextProviderProps> = ({ initialValue, children }) => {
  const [value, setValue] = useState<ContextData>(initialValue);

  return <Context.Provider value={{ value, setValue }}>{children}</Context.Provider>;
};
