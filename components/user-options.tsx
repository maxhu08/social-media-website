"use client";

import { LogIn, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Session } from "~/types";

interface UserOptionsProps {
  session: Session;
}

export const UserOptions: FC<UserOptionsProps> = ({ session }) => {
  const router = useRouter();

  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="hover:bg-black/20 dark:hover:bg-white/20 p-1 rounded-md cursor-pointer transition">
            <span>{session.name}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
            <div className="flex place-items-center w-full gap-2">
              <span>Sign out</span>
              <LogIn className="w-4 h-4 ml-auto" />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/profile/${session.id}`)}
            className="cursor-pointer">
            <div className="flex place-items-center w-full gap-2">
              <span>View profile</span>
              <User className="w-4 h-4 ml-auto" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
