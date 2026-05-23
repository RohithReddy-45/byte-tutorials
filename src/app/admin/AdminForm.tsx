"use client";
 
import LoadingButton from "@/components/LoadingButton";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { technologies } from "@/constants/constants";
import { VideoSchema, type YoutubeValues } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Search, Compass, Film, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { adminFormAction, getAvailableVideosAction, createLearningPathAction } from "./action";
 
export default function AdminForm() {
  const [activeTab, setActiveTab] = useState<"video" | "playlist">("video");
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
 
  // Form for single video
  const form = useForm<YoutubeValues>({
    resolver: zodResolver(VideoSchema),
    defaultValues: {
      link: "",
      tags: [{ label: "", slug: "" }],
    },
  });
 
  const handleVideoSubmit = (data: YoutubeValues) => {
    startTransition(async () => {
      try {
        const result = await adminFormAction(data);
        if (result.error) {
          throw new Error(result.error);
        }
        form.reset();
        setError(undefined);
        redirect("/courses");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error(error);
        } else {
          console.error(error);
          setError("Unknown error occurred");
        }
      }
    });
  };
 
  // State for learning path form
  const [pathTitle, setPathTitle] = useState("");
  const [pathSlug, setPathSlug] = useState("");
  const [pathDescription, setPathDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbVideos, setDbVideos] = useState<Array<{ videoId: string; title: string; creator: string }>>([]);
  const [selectedVideos, setSelectedVideos] = useState<Array<{ videoId: string; orderIndex: number }>>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [playlistPending, setPlaylistPending] = useState(false);
  const [playlistError, setPlaylistError] = useState<string>();
 
  // Auto-generate slug from path title
  const handleTitleChange = (val: string) => {
    setPathTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special characters
      .replace(/[\s_]+/g, "-") // spaces/underscores to hyphens
      .replace(/-+/g, "-"); // merge duplicate hyphens
    setPathSlug(generatedSlug);
  };
 
  // Fetch available videos on playlist tab focus
  useEffect(() => {
    if (activeTab === "playlist" && dbVideos.length === 0) {
      async function loadVideos() {
        try {
          setLoadingVideos(true);
          const res = await getAvailableVideosAction();
          if (res.success && res.videos) {
            setDbVideos(res.videos);
          } else {
            setPlaylistError(res.error || "Failed to load database videos.");
          }
        } catch (err) {
          setPlaylistError("Failed to fetch database videos.");
        } finally {
          setLoadingVideos(false);
        }
      }
      loadVideos();
    }
  }, [activeTab, dbVideos.length]);
 
  // Toggle video selection in checklist
  const handleToggleVideo = (videoId: string) => {
    const isSelected = selectedVideos.some((sv) => sv.videoId === videoId);
    if (isSelected) {
      const updated = selectedVideos
        .filter((sv) => sv.videoId !== videoId)
        .map((sv, idx) => ({ ...sv, orderIndex: idx + 1 }));
      setSelectedVideos(updated);
    } else {
      setSelectedVideos([...selectedVideos, { videoId, orderIndex: selectedVideos.length + 1 }]);
    }
  };
 
  // Manual override of video ordering number
  const handleOrderChange = (videoId: string, newOrder: number) => {
    setSelectedVideos(
      selectedVideos.map((sv) =>
        sv.videoId === videoId ? { ...sv, orderIndex: newOrder } : sv
      )
    );
  };
 
  // Create playlist submission handler
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathTitle.trim() || !pathSlug.trim()) {
      setPlaylistError("Title and Slug are required fields.");
      return;
    }
    if (selectedVideos.length === 0) {
      setPlaylistError("Please select at least one video to include in the learning path.");
      return;
    }
 
    // Sort selected videos by orderIndex ascending
    const sortedVideos = [...selectedVideos].sort((a, b) => a.orderIndex - b.orderIndex);
 
    setPlaylistPending(true);
    setPlaylistError(undefined);
 
    try {
      const res = await createLearningPathAction(
        pathTitle,
        pathDescription,
        pathSlug,
        sortedVideos
      );
 
      if (res.success) {
        setPathTitle("");
        setPathSlug("");
        setPathDescription("");
        setSelectedVideos([]);
        setPlaylistError(undefined);
        redirect("/courses/paths");
      } else {
        setPlaylistError(res.error || "Failed to create learning path.");
      }
    } catch (err) {
      setPlaylistError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setPlaylistPending(false);
    }
  };
 
  // Filter database videos list
  const filteredVideos = dbVideos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <div className="w-full space-y-6">
      {/* Header and Toggle Navigation Tabs */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Admin Workspace</h1>
          <p className="text-xs text-muted-foreground">Add new course contents or organize them into structured pathways.</p>
        </div>
 
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`flex-1 pb-3 text-xs font-bold border-b-2 transition duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === "video"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Film className="size-3.5" />
            Add Single Video
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("playlist")}
            className={`flex-1 pb-3 text-xs font-bold border-b-2 transition duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === "playlist"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Compass className="size-3.5" />
            Create Learning Path
          </button>
        </div>
      </div>
 
      {/* 1. Add Single Video Tab */}
      {activeTab === "video" && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleVideoSubmit)}
            className="flex flex-col gap-4"
          >
            {error && <p className="text-center text-sm font-semibold text-rose-500 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">YouTube Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} className="text-sm border-slate-200 dark:border-slate-800 text-foreground bg-background focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Custom Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Leave blank to fetch title automatically" {...field} className="text-sm border-slate-200 dark:border-slate-800 text-foreground bg-background focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Technology Tags</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (
                        !field.value.some(
                          (item: { label: string; slug: string }) =>
                            item.slug === value,
                        )
                      ) {
                        field.onChange([
                          ...field.value,
                          {
                            label:
                              technologies.find((tech) => tech.slug === value)
                                ?.label || "",
                            slug: value,
                          },
                        ]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="text-sm border-slate-200 dark:border-slate-800 text-foreground bg-background focus-visible:ring-emerald-500">
                        <SelectValue placeholder="Add tags to categorize video" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground border-slate-200 dark:border-slate-800">
                      {technologies.map((tech) => (
                        <SelectItem key={tech.slug} value={tech.slug} className="hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">
                          {tech.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {field.value
                      .filter((t) => t.slug !== "")
                      .map((tag) => (
                        <Badge
                          key={tag.slug}
                          variant="secondary"
                          className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold px-2 py-0.5 text-[10px]"
                        >
                          {tag.label}
                          <X
                            size={12}
                            className="cursor-pointer text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              field.onChange(field.value.filter((t) => t !== tag));
                            }}
                          />
                        </Badge>
                      ))}
                  </div>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <LoadingButton loading={isPending} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 mt-2">
              Submit Course Video
            </LoadingButton>
          </form>
        </Form>
      )}
 
      {/* 2. Create Learning Path Tab */}
      {activeTab === "playlist" && (
        <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
          {playlistError && (
            <p className="text-center text-sm font-semibold text-rose-500 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {playlistError}
            </p>
          )}
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Path Title</label>
              <Input
                placeholder="e.g. Next.js Foundations"
                value={pathTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-sm border-slate-200 dark:border-slate-800 text-foreground bg-background focus-visible:ring-emerald-500"
                required
              />
            </div>
 
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">URL Slug</label>
              <Input
                placeholder="e.g. nextjs-foundations"
                value={pathSlug}
                onChange={(e) => setPathSlug(e.target.value)}
                className="text-sm border-slate-200 dark:border-slate-800 text-foreground bg-background focus-visible:ring-emerald-500"
                required
              />
            </div>
          </div>
 
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Description</label>
            <Textarea
              placeholder="Describe the curriculum progression and learning goals..."
              value={pathDescription}
              onChange={(e) => setPathDescription(e.target.value)}
              className="text-sm min-h-20 border-slate-200 dark:border-slate-800 text-foreground bg-background focus-visible:ring-emerald-500 resize-none"
            />
          </div>
 
          {/* Video Selector list */}
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                Select Curriculum Videos 
                <span className="text-[10px] text-muted-foreground font-normal">
                  ({selectedVideos.length} selected)
                </span>
              </label>
 
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter database videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs border-slate-200 dark:border-slate-800 text-foreground bg-background"
                />
              </div>
            </div>
 
            {loadingVideos ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-slate-500 gap-2">
                <Loader2 className="size-5 animate-spin text-emerald-500" />
                <span className="text-xs">Loading available videos...</span>
              </div>
            ) : dbVideos.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg text-xs text-muted-foreground">
                No videos available in the database to build paths. Add videos first!
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg max-h-[250px] overflow-y-auto divide-y divide-slate-150 dark:divide-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-2 space-y-1">
                {filteredVideos.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground p-4">No matching videos found.</p>
                ) : (
                  filteredVideos.map((video) => {
                    const selectedItem = selectedVideos.find((sv) => sv.videoId === video.videoId);
                    const isSelected = !!selectedItem;
 
                    return (
                      <div
                        key={video.videoId}
                        className={`flex items-center justify-between p-2.5 rounded-md border transition ${
                          isSelected
                            ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/20"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 pr-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleVideo(video.videoId)}
                            className="size-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <div className="text-xs">
                            <p className="font-semibold text-foreground leading-snug line-clamp-1">{video.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{video.creator}</p>
                          </div>
                        </div>
 
                        {isSelected && (
                          <div className="flex items-center gap-1.5 shrink-0 bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Step</span>
                            <input
                              type="number"
                              min={1}
                              value={selectedItem.orderIndex}
                              onChange={(e) => handleOrderChange(video.videoId, Number(e.target.value))}
                              className="w-10 h-6 text-center text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded focus:outline-none focus:border-emerald-500 text-foreground"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
 
          <LoadingButton
            loading={playlistPending}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 mt-2"
          >
            Create Learning Path
          </LoadingButton>
        </form>
      )}
    </div>
  );
}
