import Link from "next/link";
import { FC } from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import { buttonVariants } from "~/components/ui/button";
import { UserOptions } from "~/components/user-options";
import { getAuthSession } from "~/lib/auth";

export const Navbar: FC = async () => {
  const session = await getAuthSession();

  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-2 fixed top-0 left-0 w-full">
      <div className="grid grid-flow-col place-items-center gap-2">
        <Link href="/" className="mr-auto">
          social media website
        </Link>
        <div className="w-max ml-auto grid grid-flow-col gap-2 place-items-center">
          {session ? (
            <UserOptions session={session} />
          ) : (
            <>
              <Link href="/sign-up" className={buttonVariants()}>
                sign up
              </Link>
              <Link href="/sign-in" className={buttonVariants()}>
                sign in
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
