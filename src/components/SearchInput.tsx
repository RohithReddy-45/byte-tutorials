"use client";

import { Input } from "@/components/ui/input";
import { useParams } from "@/helpers/search-params";
import { SearchIcon } from "lucide-react";

export default function SearchInput() {
  const { q, setParams } = useParams();

  return (
    <form
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setParams({ q: e.currentTarget.q.value });
        }
      }}
      className="relative"
    >
      <Input
        value={q ?? ""}
        onChange={(e) => setParams({ q: e.target.value })}
        placeholder="Search..."
        className="w-full pl-10"
        name="q"
      />
      <SearchIcon
        size={20}
        className="absolute top-2.5 left-2 stroke-gray-400"
      />
    </form>
  );
}
