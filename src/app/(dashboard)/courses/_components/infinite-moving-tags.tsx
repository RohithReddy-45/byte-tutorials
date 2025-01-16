"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { technologies } from "@/constants/constants";
import { useParams } from "@/helpers/search-params";

interface InfiniteMovingTagsProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
}

export function InfiniteMovingTags({
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  ...props
}: InfiniteMovingTagsProps) {
  const { tech, setParams } = useParams();
  const selectedTech = tech ? tech.split(",") : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      for (const item of scrollerContent) {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      }

      setStart(true);
      getDirection();
      getSpeed();
    }
  }

  const handleClick = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
    newTech: string,
  ) => {
    e.preventDefault();
    if (!selectedTech.includes(newTech)) {
      const updatedTech = [...selectedTech, newTech];
      setParams({ tech: updatedTech.join(",") });
    }
  };

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "slow") {
        containerRef.current.style.setProperty("--animation-duration", "100s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "50s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] dark:[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className,
      )}
      {...props}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 pb-2 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {technologies.map((item) => (
          <li key={item.slug}>
            <button
              type="button"
              onClick={(e) => {
                handleClick(e, item.slug);
              }}
              className="w-max max-w-full flex-shrink-0 rounded-full px-2 py-1 text-xs text-white font-medium cursor-pointer bg-blue-600"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
