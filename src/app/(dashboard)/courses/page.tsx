import { PER_PAGE } from "@/constants/constants";
import {
  filterYoutubeDetailsByQuery,
  filterYoutubeDetailsByTags,
  getYoutubeDetailsPaginated,
} from "@/lib/queries";
import type { YoutubeDetails } from "@/lib/types";
import { getCurrentSession } from "@/lib/validate-request";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import CourseSection from "./_components/course-section";
import PageNavigation from "./_components/page-navigation";
import { PulseLoader } from "./_components/pulse-loader";

export const metadata: Metadata = {
  title: "Browse Courses",
  description:
    "Browse our curated collection of programming tutorials and tech courses from top YouTube educators",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Dashboard(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page
    ? Number.parseInt(searchParams.page as string)
    : 1;
  const query = searchParams.q as string;
  const tech = searchParams.tech as string;
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/sign-in");
  }

  let coursesData: {
    data: YoutubeDetails[];
    total: number;
    perPage: number;
  } = { data: [], total: 0, perPage: PER_PAGE };

  try {
    if (query || tech) {
      const response: {
        queryResults?: YoutubeDetails[];
        tagResults?: YoutubeDetails[];
      } = {};
      if (query) {
        response.queryResults = (
          await filterYoutubeDetailsByQuery(query, page, PER_PAGE)
        ).data;
      }

      if (tech) {
        response.tagResults = (
          await filterYoutubeDetailsByTags(tech, page, PER_PAGE)
        ).data;
      }

      const combinedResults = [
        ...(response.queryResults || []),
        ...(response.tagResults || []),
      ];
      const uniqueResults = Array.from(
        new Set(combinedResults.map((r) => r.id)),
      ).map((id) => combinedResults.find((r) => r.id === id));

      const startIndex = (page - 1) * PER_PAGE;
      const endIndex = startIndex + PER_PAGE;
      coursesData = {
        data: uniqueResults.slice(startIndex, endIndex) as YoutubeDetails[],
        total: uniqueResults.length,
        perPage: PER_PAGE,
      };
    } else {
      coursesData = await getYoutubeDetailsPaginated(user.id, page, PER_PAGE);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }

  const totalPages = Math.ceil(coursesData.total / coursesData.perPage);

  return (
    <div className="flex flex-col flex-1 gap-5 lg:flex-row">
      <div className="w-full overflow-auto pb-7">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <PulseLoader key={index} />
              ))}
            </div>
          }
        >
          <CourseSection courses={coursesData.data} />
          {coursesData.total >= PER_PAGE && (
            <PageNavigation totalPages={totalPages} currentPage={page} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
