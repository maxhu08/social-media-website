import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export const Control: FC = () => {
  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-2 sm:rounded-md">
      <Link href="/posts/create">
        <div className="grid place-items-center grid-cols-[max-content_max-content] gap-1 hover:bg-black/20 dark:hover:bg-white/20 w-max p-1 rounded-md transition">
          <Plus className="w-4 h-4" />
          <span>create post</span>
        </div>
      </Link>
    </div>
  );
};
