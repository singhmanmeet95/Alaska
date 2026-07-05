import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../../store/useAuthStore";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getStationId } from "../../../utils/stationsMap";
import { SuffixAutomaton } from "../../../utils/SuffixAutomaton";

interface MapOverlayProps {
  customPath: string[]; // List of station names
  onSubmit: () => void; // Unused after logic migration, keeping interface intact for mapbox.tsx
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function MapOverlay({ customPath }: MapOverlayProps) {
  const { user, token } = useAuthStore();
  const [width, setWidth] = useState(320); // Initial width in pixels
  const isResizingRef = useRef(false);

  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [matchers, setMatchers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [tripTime, setTripTime] = useState<string>(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Handle resizing logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = Math.max(
        320,
        Math.min(window.innerWidth * 0.8, e.clientX),
      );
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startResize = () => {
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
  };

  const startStation = customPath.length > 0 ? customPath[0] : "";
  const endStation =
    customPath.length > 1 ? customPath[customPath.length - 1] : "";

  const handleInitialSubmit = () => {
    if (customPath.length < 2) return;
    setShowDialog(true);
  };

  const fetchMatchers = async (p: number) => {
    setIsLoading(true);
    try {
      const idmap = new Map<string, number>();
      const encodedIds: number[] = [];

      for (const station of customPath) {
        const stationId = getStationId(station);
        if (stationId !== null) {
          encodedIds.push(stationId);
          // idmap for building SuffixAutomaton needs string -> id, but here we can just use the stationId as the 'character'
          if (!idmap.has(stationId.toString())) {
            idmap.set(stationId.toString(), stationId);
          }
        }
      }

      // We use stringified IDs for building SAM because it expects string tokens in the original logic,
      // but actually SuffixAutomaton in TS expects tokens: string[], idmap: Map<string, number>
      // Let's pass the stringified IDs as tokens.
      const tokens = encodedIds.map(String);
      const sa = new SuffixAutomaton(tokens, idmap);

      const res = await axios.post(
        `${API_URL}/utils/path/match_trips`,
        {
          sam: sa.serialize(),
          totalStations: customPath.length, // For pagination/stats
          page: p,
          limit: 10,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMatchers(res.data.data);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (saveToDb: boolean) => {
    setShowDialog(false);
    setIsLoading(true);
    try {
      if (saveToDb && user) {
        const encodedIds = customPath.map(getStationId).filter(id => id !== null) as number[];
        await axios.post(
          `${API_URL}/trips`,
          {
            userId: user.id,
            startTime: new Date(tripTime).toISOString(),
            stationList: encodedIds,
            length: encodedIds.length - 1,
            startStation: encodedIds[0],
            endStation: encodedIds[encodedIds.length - 1],
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      await fetchMatchers(1);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (e: React.MouseEvent, receiverId: string) => {
    e.stopPropagation(); // prevent clicking the card and navigating to user profile
    try {
      await axios.post(
        `${API_URL}/friendships/request`,
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Update matchers in state to show PENDING or similar
      setMatchers((prev) =>
        prev.map((m) =>
          m.user.id === receiverId
            ? { ...m, friendshipStatus: "SENT_REQUEST" }
            : m,
        ),
      );
    } catch (err) {
      console.error(err);
      alert(
        "Failed to send request. You might have already sent one or are friends.",
      );
    }
  };

  return (
    <div
      className="absolute top-0 bottom-0 left-0 bg-background border-r border-border flex flex-col z-[1000] shadow-xl font-sans"
      style={{ width: `${width}px` }}
    >
      {/* Top Controls Section */}
      <div className="flex flex-col p-4 gap-4 shrink-0 border-b border-border">
        <h2 className="text-foreground font-headline text-lg">Route Settings</h2>

        {/* Stations Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider">
              Start
            </span>
            <div
              className="bg-card border border-border p-3 rounded-[var(--radius-pill)] text-sm text-foreground font-mono truncate"
              title={startStation}
            >
              {startStation || "None"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider">
              End
            </span>
            <div
              className="bg-card border border-border p-3 rounded-[var(--radius-pill)] text-sm text-foreground font-mono truncate"
              title={endStation}
            >
              {endStation || "None"}
            </div>
          </div>
        </div>

        {/* Time Selector */}
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-eyebrow text-[10px] text-foreground/50 uppercase tracking-wider">
            Departure Time
          </span>
          <input
            type="datetime-local"
            value={tripTime}
            onChange={(e) => setTripTime(e.target.value)}
            className="w-full bg-card border border-border p-3 rounded-[var(--radius-pill)] text-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleInitialSubmit}
          disabled={customPath.length < 2 || isLoading}
          className={`w-full py-2.5 rounded-[var(--radius-pill)] font-button text-sm transition-colors border ${
            customPath.length >= 2
              ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
              : "bg-background text-foreground/30 border-border cursor-not-allowed"
          }`}
        >
          {isLoading
            ? "LOADING..."
            : customPath.length < 2
              ? "SELECT"
              : "SUBMIT"}
        </button>
      </div>

      <div className="flex-1 w-full bg-background p-4 overflow-y-auto flex flex-col gap-4">
        {!hasSearched ? (
          <div className="border border-dashed border-border rounded-lg h-full flex flex-col items-center justify-center text-foreground/50 text-sm gap-2">
            <p className="font-headline">Analysis Results Area</p>
            <p className="font-body-sm text-[12px] text-foreground/40">
              Submit a path to find matchers
            </p>
          </div>
        ) : matchers.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg h-full flex items-center justify-center text-foreground/50 text-sm font-body">
            No active matchers found for this route.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {matchers.map((match) => (
              <div
                key={match.id}
                onClick={() => navigate(`/user/${match.user.id}`)}
                className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                title="View Profile"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {match.user.profile_image ? (
                      <img
                        src={match.user.profile_image}
                        alt={match.user.name}
                        className="w-10 h-10 rounded-[var(--radius-pill)] object-cover border border-border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-[var(--radius-pill)] bg-background flex items-center justify-center text-foreground font-bold border border-border">
                        {match.user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-foreground font-headline text-sm w-max">
                        {match.user.name}
                      </span>
                      <span className="text-foreground/50 font-body-sm text-[10px]">
                        {match.lcsLen} stations match
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-[var(--radius-pill)] border border-border">
                      <span className="text-[12px] font-headline text-yellow-500">
                        {Number(match.user.ratings || 0).toFixed(1)}
                      </span>
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    </div>

                    {/* Friend Request Button */}
                    {match.friendshipStatus === "NONE" && (
                      <button
                        onClick={(e) => handleAddFriend(e, match.user.id)}
                        className="px-3 py-1 bg-primary text-primary-foreground font-button text-[12px] rounded-[var(--radius-pill)] hover:opacity-90 transition-colors"
                      >
                        Add
                      </button>
                    )}
                    {match.friendshipStatus === "SENT_REQUEST" && (
                      <span className="px-3 py-1 bg-background text-foreground/50 text-[10px] font-eyebrow rounded-[var(--radius-pill)] border border-border">
                        Pending
                      </span>
                    )}
                    {match.friendshipStatus === "RECEIVED_REQUEST" && (
                      <span className="px-3 py-1 bg-background text-foreground/50 text-[10px] font-eyebrow rounded-[var(--radius-pill)] border border-border">
                        Respond
                      </span>
                    )}
                    {match.friendshipStatus === "ACCEPTED" && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-eyebrow rounded-[var(--radius-pill)] border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Friends
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 bg-card p-2 rounded-xl border border-border">
                <button
                  onClick={() => fetchMatchers(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 text-foreground/50 hover:text-foreground disabled:opacity-30 disabled:hover:text-foreground/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-eyebrow text-[10px] text-foreground/50">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchMatchers(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 text-foreground/50 hover:text-foreground disabled:opacity-30 disabled:hover:text-foreground/50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors group z-50"
        onMouseDown={startResize}
      />

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-fade-in-up">
            <h3 className="text-lg font-headline text-foreground">Save Trip?</h3>
            <p className="font-body-sm text-[12px] text-foreground/70 leading-relaxed">
              Do you want us to put your data in the database too, so other
              people can match with you on this route?
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => handleFinalSubmit(false)}
                className="px-4 py-2 bg-background hover:bg-card border border-border text-foreground font-button text-[12px] rounded-[var(--radius-pill)] transition-colors"
              >
                No, just search
              </button>
              <button
                onClick={() => handleFinalSubmit(true)}
                className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground font-button text-[12px] rounded-[var(--radius-pill)] transition-colors"
              >
                Yes, save it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
