import CourseCard from "@/components/CourseCard";
import { getUserWatchlist } from "@/lib/queries";
import type { YoutubeDetails } from "@/lib/types";
import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import { getAllVideoProgress } from "@/app/(dashboard)/courses/actions/progress-action";

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
  const progressRes = await getAllVideoProgress();
  const progressList = progressRes.success && progressRes.data ? progressRes.data : [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {courses.map((course) => {
        const videoProgress = progressList.find((p) => p.videoId === course.videoId);
        return (
          <CourseCard
            key={course.id}
            courses={course}
            initialIsBookmarked={watchlistVideoIds.includes(course.videoId)}
            initialProgress={videoProgress}
          />
        );
      })}
    </div>
  );
}
