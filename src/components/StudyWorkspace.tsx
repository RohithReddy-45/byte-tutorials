"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Trash2, Clock, CheckCircle, Plus, BookOpen, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { getVideoNotes, addVideoNote, deleteVideoNote } from "@/app/(dashboard)/courses/actions/notes-action";
import { updateVideoProgress, getVideoProgress } from "@/app/(dashboard)/courses/actions/progress-action";
import type { VideoNote } from "@/db/schema";

interface StudyWorkspaceProps {
  videoId: string;
  title: string;
  creator: string;
  onClose: () => void;
  onProgressUpdate?: (percent: number, status: string) => void;
}

export default function StudyWorkspace({
  videoId,
  title,
  creator,
  onClose,
  onProgressUpdate,
}: StudyWorkspaceProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [manualProgressSyncing, setManualProgressSyncing] = useState(false);
  const [status, setStatus] = useState<"not_started" | "in_progress" | "completed">("not_started");

  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const latestPositionRef = useRef(0);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoadingNotes(true);
        // Fetch notes
        const notesRes = await getVideoNotes(videoId);
        if (notesRes.success && notesRes.data) {
          setNotes(notesRes.data);
        }

        // Fetch watch progress
        const progressRes = await getVideoProgress(videoId);
        if (progressRes.success && progressRes.data) {
          setStatus(progressRes.data.status);
          const lastPos = progressRes.data.lastPosition;
          setCurrentTime(lastPos);
          currentTimeRef.current = lastPos;
          latestPositionRef.current = lastPos;

          // Seek if player is ready
          if (playerRef.current && typeof playerRef.current.seekTo === "function") {
            playerRef.current.seekTo(lastPos, true);
          }
        }
      } catch (error) {
        console.error("Failed to load initial workspace data:", error);
      } finally {
        setLoadingNotes(false);
      }
    }

    currentTimeRef.current = 0;
    latestPositionRef.current = 0;
    durationRef.current = 0;
    setCurrentTime(0);
    setDuration(0);
    setPlayerReady(false);
    setStatus("not_started");

    loadInitialData();
  }, [videoId]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let playerInstance: any;

    const onPlayerReady = (event: any) => {
      setPlayerReady(true);
      const totalDur = event.target.getDuration();
      setDuration(totalDur);
      durationRef.current = totalDur;

      // Seek to initial position if loaded from database
      if (latestPositionRef.current > 0) {
        event.target.seekTo(latestPositionRef.current, true);
      }
    };

    const onPlayerStateChange = (event: any) => {
      // YT.PlayerState.PLAYING = 1
      if (event.data === 1) {
        startProgressTracking(event.target);
      } else {
        stopProgressTracking();
        syncProgress(event.target);
      }
    };

    const initPlayer = () => {
      const wrapper = document.getElementById("youtube-study-player-wrapper");
      if (wrapper) {
        wrapper.innerHTML = '<div id="youtube-study-player-container" class="absolute inset-0 h-full w-full border-0"></div>';
      }

      playerInstance = new window.YT.Player("youtube-study-player-container", {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          enablejsapi: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
          rel: 0,
          playsinline: 1,
          controls: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
      playerRef.current = playerInstance;
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    }

    return () => {
      stopProgressTracking();
      if (playerInstance && typeof playerInstance.destroy === "function") {
        playerInstance.destroy();
      }
    };
  }, [videoId]);

  // Start tracking time and duration on interval
  const startProgressTracking = (player: any) => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (player && typeof player.getCurrentTime === "function") {
        const current = Math.floor(player.getCurrentTime());
        setCurrentTime(current);
        currentTimeRef.current = current;

        // Periodically sync progress (every 10 seconds)
        if (current % 10 === 0) {
          syncProgress(player);
        }
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Sync progress back to server
  const syncProgress = async (player: any, manualStatus?: "not_started" | "in_progress" | "completed") => {
    if (!player || typeof player.getCurrentTime !== "function") return;
    const current = Math.floor(player.getCurrentTime());
    const total = Math.floor(player.getDuration() || durationRef.current || duration);

    if (total === 0) return;

    try {
      const res = await updateVideoProgress(videoId, current, total, manualStatus);
      if (res.success && res.status) {
        setStatus(res.status);
        if (onProgressUpdate) {
          const percent = Math.min(100, Math.floor((current / total) * 100));
          onProgressUpdate(percent, res.status);
        }
      }
    } catch (err) {
      console.error("Error syncing watch progress:", err);
    }
  };

  // Click handler to seek video to timestamp
  const handleSeek = (seconds: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
  };

  // Add a new note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    try {
      setSavingNote(true);
      const res = await addVideoNote(videoId, newNoteText.trim(), currentTimeRef.current);
      if (res.success && res.data) {
        setNotes((prev) => [...prev, res.data as VideoNote].sort((a, b) => a.timestamp - b.timestamp));
        setNewNoteText("");
        toast({
          description: "Note added successfully!",
        });

        // Trigger progress sync to reflect activity in DB
        if (playerRef.current) {
          syncProgress(playerRef.current);
        }
      } else {
        throw new Error(res.error || "Failed to add note");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to add note",
      });
    } finally {
      setSavingNote(false);
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await deleteVideoNote(noteId);
      if (res.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        toast({
          description: "Note deleted.",
        });
      } else {
        throw new Error(res.error || "Failed to delete note");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to delete note",
      });
    }
  };

  // Manually toggle completed status
  const handleToggleComplete = async () => {
    if (!playerRef.current) return;
    try {
      setManualProgressSyncing(true);
      const newStatus = status === "completed" ? "in_progress" : "completed";
      await syncProgress(playerRef.current, newStatus);
      toast({
        description: newStatus === "completed" ? "Marked as completed!" : "Marked as in progress.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setManualProgressSyncing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-background text-foreground rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Video Section */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
        <div id="youtube-study-player-wrapper" className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <div id="youtube-study-player-container" className="absolute inset-0 h-full w-full border-0" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{creator}</span>
              <h1 className="text-lg font-bold leading-snug line-clamp-2 text-foreground">{title}</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={manualProgressSyncing || !playerReady}
              onClick={handleToggleComplete}
              className={`flex-shrink-0 text-xs gap-1 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground ${
                status === "completed" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30" : ""
              }`}
            >
              <CheckCircle className={`size-3.5 ${status === "completed" ? "fill-emerald-400 text-emerald-950" : ""}`} />
              {status === "completed" ? "Completed" : "Mark Complete"}
            </Button>
          </div>
          {duration > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 w-fit">
              <Clock className="size-3.5 text-muted-foreground" />
              <span>Current Time: <strong className="text-foreground">{formatTime(currentTime)}</strong></span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span>Duration: <strong className="text-foreground">{formatTime(duration)}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-50 dark:bg-slate-950 h-[450px] lg:h-auto border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-emerald-500 dark:text-emerald-400" />
            <h2 className="font-semibold text-foreground">Interactive Study Notes</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"
            aria-label="Close study workspace"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loadingNotes ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
              <Loader2 className="size-6 animate-spin text-emerald-500" />
              <span className="text-xs">Loading study notes...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-4 py-8">
              <BookOpen className="size-10 mb-2 text-slate-700 stroke-[1.5]" />
              <span className="text-sm font-medium">No notes taken yet.</span>
              <span className="text-xs mt-1 text-slate-600">Start watching and type below to bookmark concepts.</span>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group relative p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/70 hover:border-slate-350 dark:hover:border-slate-700 transition duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => handleSeek(note.timestamp)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition duration-150 mb-1.5"
                  >
                    <Play className="size-2.5 fill-current" />
                    {formatTime(note.timestamp)}
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 transition duration-150 p-1 text-muted-foreground hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-900 rounded"
                    title="Delete Note"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 break-words leading-relaxed">{note.noteText}</p>
              </div>
            ))
          )}
        </div>

        {/* Note Input */}
        <form onSubmit={handleAddNote} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/30 space-y-2">
          <div className="relative">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write a note... (e.g. Set up database connection)"
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 resize-none h-20 focus:outline-none transition duration-150"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground">
              Note will link to timestamp <strong className="text-slate-700 dark:text-slate-300">{formatTime(currentTime)}</strong>
            </span>
            <Button
              type="submit"
              disabled={savingNote || !newNoteText.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs px-3 h-8 font-semibold rounded-md gap-1"
            >
              {savingNote ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              Add Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
