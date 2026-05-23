"use client";

import { logoutAction as logout } from "@/app/(auth)/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/providers/SessionProvider";
import Image from "next/image";
import { useState } from "react";

export default function Avatar() {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;
  if (!user.avatarUrl) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-x-2">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              width={35}
              height={35}
              alt="User avatar"
              className="size-8 rounded-full max-w-max"
            />
          ) : (
            <div className="relative size-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <svg
                className="absolute size-10 text-gray-400 -left-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <div className="font-medium line-clamp-1 min-w-max hidden sm:block" data-testid="user-avatar">
            {user.displayName}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-[1px] dark:border-neutral-700 mt-3">
        <DropdownMenuItem>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await logout();
            }}
          >
            <button type="submit">Logout</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
