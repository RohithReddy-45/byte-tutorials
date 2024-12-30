import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function PulseLoader() {
  return (
    <Card className="overflow-hidden border-none">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}
