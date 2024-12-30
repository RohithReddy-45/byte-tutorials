"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { technologies } from "@/constants/constants";
import { useParams } from "@/helpers/search-params";
import { X } from "lucide-react";
import { useState } from "react";

export default function FilterCard() {
  const { tech, setParams } = useParams();
  const selectedTech = tech ? tech.split(",") : [];
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTech = (newTech: string) => {
    if (!selectedTech.includes(newTech)) {
      const updatedTech = [...selectedTech, newTech];
      setParams({ tech: updatedTech.join(",") });
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    const updatedTech = selectedTech.filter((t) => t !== techToRemove);
    setParams({ tech: updatedTech.join(",") });
  };

  const handleSelectClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handlePointerDownOutside = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative z-10">
      <Select
        onValueChange={(value) => handleSelectTech(value)}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-full" onClick={(e) => e.stopPropagation()}>
          <SelectValue placeholder="Select technology" />
        </SelectTrigger>
        <SelectContent
          className="z-50"
          onPointerDownOutside={handlePointerDownOutside}
          onClick={(e) => e.stopPropagation()}
        >
          {technologies.map((t) => (
            <SelectItem
              key={t}
              value={t}
              onClick={handleSelectClick}
              className="cursor-pointer"
            >
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTech.map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {t}
            <X
              size={14}
              className="cursor-pointer"
              onClick={() => handleRemoveTech(t)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}
