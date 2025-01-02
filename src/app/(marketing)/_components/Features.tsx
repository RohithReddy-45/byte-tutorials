import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Bookmark } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Curated Content",
    description:
      "Hand-picked courses from top YouTube educators, ensuring quality learning experiences.",
  },
  {
    icon: <Bookmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Personal Watchlist",
    description:
      "Save your favorite courses to your watchlist and track your learning progress.",
  },
  {
    icon: <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Smart Search",
    description: "Find courses by programming language or framework.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="flex h-fit max-w-7xl container mx-auto flex-col gap-5 p-10 text-center leading-6 sm:px-20 mt-16">
      <h2 className="text-3xl font-bold sm:text-4xl mb-12 md:text-6xl">
        Why Choose DevTube?
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 last:col-span-full shrink-0 gap-8">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-0 bg-background/60 backdrop-blur-xl md:last:col-span-2 lg:last:col-span-1"
          >
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base sm:text-md dark:text-gray-300">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
