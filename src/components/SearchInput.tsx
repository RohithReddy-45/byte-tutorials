"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useParams } from "@/helpers/search-params";
import { DynamicLoader } from "./DynamicLoader";

export default function SearchInput() {
  const { q, setParams } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setParams({ q: e.target.value });
  };

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
        onChange={handleInputChange}
        placeholder="Search..."
        className="w-full pl-10"
        name="q"
      />
      <DynamicLoader
        isLoading={loading}
        size="sm"
        className="absolute top-3 left-3"
      />
    </form>
  );
}
