"use client";

import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useParams } from "@/helpers/search-params";
import { Badge } from "./badge";
import { X } from "lucide-react";
import { technologies } from "@/constants/constants";

function TechFilter() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const { tech, setParams } = useParams();
  const selectedTech = tech ? tech.split(",") : [];

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

  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="select" className="sr-only">
        Select with search
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="select"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? technologies.find((tech) => tech.slug === value)?.label
                : "Select technology"}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search technologies..." />
            <CommandList>
              <CommandEmpty>No technology found.</CommandEmpty>
              <CommandGroup>
                {technologies.map((tech) => (
                  <CommandItem
                    key={tech.slug}
                    value={tech.slug}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      handleSelectTech(currentValue);
                      setOpen(false);
                    }}
                  >
                    {tech.label}
                    {value === tech.slug && (
                      <Check size={16} strokeWidth={2} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTech.map((val) => {
          const tech = technologies.find((tech) => tech.slug === val);
          return (
            <Badge
              key={val}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tech ? tech.label : val}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => handleRemoveTech(val)}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

export { TechFilter };
