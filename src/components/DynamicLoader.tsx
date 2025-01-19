import { cn } from "@/lib/utils";

interface DynamicLoaderProps {
  isLoading: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const DynamicLoader: React.FC<DynamicLoaderProps> = ({
  isLoading,
  size = "md",
  className,
  color = "text-gray-400",
}) => {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {isLoading ? (
        <div
          className={`absolute inset-0 ${color} border-2 border-solid border-current border-r-transparent rounded-full animate-spin`}
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${color} transition-opacity duration-300`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      )}
    </div>
  );
};
