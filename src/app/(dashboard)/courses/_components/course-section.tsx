import CourseCard from "@/components/CourseCard";
import { getUserWatchlist } from "@/lib/queries";
import type { YoutubeDetails } from "@/lib/types";
import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";

interface CourseSectionProps {
  courses: YoutubeDetails[];
}

export default async function CourseSection({ courses }: CourseSectionProps) {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/sign-in");
  }

  if (!courses || courses.length === 0) {
    return (
      <p className="text-xl text-center mt-10 md:text-2xl text-muted-foreground">
        No courses found.
      </p>
    );
  }

  const watchlistVideoIds = await getUserWatchlist(user.id);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          courses={course}
          initialIsBookmarked={watchlistVideoIds.includes(course.videoId)}
        />
      ))}
    </div>
  );
}
