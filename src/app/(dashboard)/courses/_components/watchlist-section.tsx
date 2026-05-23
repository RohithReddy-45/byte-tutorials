import CourseCard from "@/components/CourseCard";
import { getUserWatchlist } from "@/lib/queries";
import type { YoutubeDetails } from "@/lib/types";
import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import { getAllVideoProgress } from "@/app/(dashboard)/courses/actions/progress-action";

interface WatchlistSectionProps {
  courses: YoutubeDetails[];
}

export default async function WatchlistSection({
  courses,
}: WatchlistSectionProps) {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/sign-in");
  }

  if (!courses || courses.length === 0) {
    return <span>No videos found</span>;
  }

  const watchlist = await getUserWatchlist(user.id);
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
            initialIsBookmarked={watchlist.includes(course.videoId)}
            initialProgress={videoProgress}
          />
        );
      })}
    </div>
  );
}
