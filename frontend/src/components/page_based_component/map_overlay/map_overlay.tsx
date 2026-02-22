import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../../store/useAuthStore";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

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
      const res = await axios.post(
        `${API_URL}/utils/path/match_trips`,
        {
          stationList: customPath,
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
        await axios.post(
          `${API_URL}/trips`,
          {
            userId: user.id,
            startTime: new Date().toISOString(),
            stationList: customPath,
            length: customPath.length - 1,
            startStation: customPath[0],
            endStation: customPath[customPath.length - 1],
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
      className="absolute top-0 bottom-0 left-0 bg-zinc-950 border-r border-zinc-800 flex flex-col z-[1000] shadow-xl"
      style={{ width: `${width}px` }}
    >
      {/* Top Controls Section */}
      <div className="flex flex-col p-4 gap-4 shrink-0 border-b border-zinc-800">
        <h2 className="text-zinc-100 font-semibold text-lg">Route Settings</h2>

        {/* Stations Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Start
            </span>
            <div
              className="bg-zinc-900 border border-zinc-700/50 p-3 rounded text-sm text-zinc-300 font-mono truncate"
              title={startStation}
            >
              {startStation || "None"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              End
            </span>
            <div
              className="bg-zinc-900 border border-zinc-700/50 p-3 rounded text-sm text-zinc-300 font-mono truncate"
              title={endStation}
            >
              {endStation || "None"}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleInitialSubmit}
          disabled={customPath.length < 2 || isLoading}
          className={`w-full py-2.5 rounded font-medium text-sm transition-colors ${
            customPath.length >= 2
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {isLoading
            ? "LOADING..."
            : customPath.length < 2
              ? "SELECT"
              : "SUBMIT"}
        </button>
      </div>

      <div className="flex-1 w-full bg-zinc-900/30 p-4 overflow-y-auto flex flex-col gap-4">
        {!hasSearched ? (
          <div className="border border-dashed border-zinc-700 rounded-lg h-full flex flex-col items-center justify-center text-zinc-500 text-sm gap-2">
            <p>Analysis Results Area</p>
            <p className="text-xs text-zinc-600">
              Submit a path to find matchers
            </p>
          </div>
        ) : matchers.length === 0 ? (
          <div className="border border-dashed border-zinc-700 rounded-lg h-full flex items-center justify-center text-zinc-500 text-sm">
            No active matchers found for this route.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {matchers.map((match) => (
              <div
                key={match.id}
                onClick={() => navigate(`/user/${match.user.id}`)}
                className="bg-zinc-800 border border-zinc-700/50 rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:border-zinc-500 transition-colors"
                title="View Profile"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {match.user.profile_image ? (
                      <img
                        src={match.user.profile_image}
                        alt={match.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold">
                        {match.user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-zinc-100 font-medium text-sm border-b border-transparent hover:border-zinc-300 transition-colors w-max">
                        {match.user.name}
                      </span>
                      <span className="text-zinc-400 text-xs">
                        {match.lcsLen} stations match
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-zinc-900/50 px-2 py-1 rounded">
                      <span className="text-sm font-bold text-amber-400">
                        {Number(match.user.ratings || 0).toFixed(1)}
                      </span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>

                    {/* Friend Request Button */}
                    {match.friendshipStatus === "NONE" && (
                      <button
                        onClick={(e) => handleAddFriend(e, match.user.id)}
                        className="px-3 py-1 bg-white text-black text-xs font-semibold rounded hover:bg-zinc-200 transition-colors"
                      >
                        Add
                      </button>
                    )}
                    {match.friendshipStatus === "SENT_REQUEST" && (
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs font-semibold rounded border border-zinc-700">
                        Pending
                      </span>
                    )}
                    {match.friendshipStatus === "RECEIVED_REQUEST" && (
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs font-semibold rounded border border-zinc-700">
                        Respond
                      </span>
                    )}
                    {match.friendshipStatus === "ACCEPTED" && (
                      <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-semibold rounded border border-blue-900/50">
                        Friends
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <button
                  onClick={() => fetchMatchers(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-medium text-zinc-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchMatchers(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-white">Save Trip?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Do you want us to put your data in the database too, so other
              people can match with you on this route?
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => handleFinalSubmit(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded transition-colors"
              >
                No, just search
              </button>
              <button
                onClick={() => handleFinalSubmit(true)}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-sm font-medium rounded transition-colors"
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
