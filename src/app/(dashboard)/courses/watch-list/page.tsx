import { PER_PAGE } from "@/constants/constants";
import { fetchWatchlistData } from "@/lib/queries";
import { getCurrentSession } from "@/lib/validate-request";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageNavigation from "../_components/page-navigation";
import WatchlistSection from "../_components/watchlist-section";

export const metadata: Metadata = {
  title: "Your Watchlist",
  description:
    "Manage and track your saved programming tutorials and tech courses",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function WatchlistPage(props: {
  searchParams: SearchParams;
}) {
  const session = await getCurrentSession();

  if (!session.user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const page = searchParams.page
    ? Number.parseInt(searchParams.page as string)
    : 1;
  const query = searchParams.q as string;
  const tech = searchParams.tech as string;

  const coursesData = await fetchWatchlistData(
    session.user.id,
    query,
    tech,
    page,
  ).catch(() => {
    console.error("Error fetching watchlist");
    return { data: [], total: 0, perPage: PER_PAGE };
  });

  const totalPages = Math.ceil(coursesData.total / coursesData.perPage);

  if (totalPages > 0 && page > totalPages) {
    redirect(totalPages > 1 ? `?page=${totalPages}` : "?page=1");
  }

  if (coursesData.total === 0 || !coursesData.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl md:text-2xl text-muted-foreground">
          No courses in your watchlist
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-medium">My Watchlist</h1>
      <div className="flex flex-col flex-1 gap-5 lg:flex-row">
        <div className="w-full overflow-auto pb-7">
          <WatchlistSection
            courses={coursesData.data.map((course) => ({
              ...course,
              title: course.title ?? "",
              tags: course.tags ?? [],
              creator: course.creator ?? "",
              creatorUrl: course.creatorUrl ?? "",
            }))}
          />
          {coursesData.total > PER_PAGE && (
            <PageNavigation totalPages={totalPages} currentPage={page} />
          )}
        </div>
      </div>
    </>
  );
}
