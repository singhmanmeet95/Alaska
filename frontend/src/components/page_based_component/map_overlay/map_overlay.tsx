import { useState, useEffect, useRef } from "react";

import axios from "axios";
import { useAuthStore } from "../../../store/useAuthStore";
import { getStationId } from "../../../utils/stationsMap";
import { SuffixAutomaton } from "../../../utils/SuffixAutomaton";
import { RouteSettings, MatchersList, SaveTripDialog } from "./";

interface MapOverlayProps {
  customPath: string[]; // List of station names
  onSubmit: () => void; // Unused after logic migration, keeping interface intact for mapbox.tsx
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function MapOverlay({ customPath }: MapOverlayProps) {
  const { user, token } = useAuthStore();
  const [width, setWidth] = useState(320); // Initial width in pixels
  const isResizingRef = useRef(false);

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
      <RouteSettings
        startStation={startStation}
        endStation={endStation}
        tripTime={tripTime}
        setTripTime={setTripTime}
        isLoading={isLoading}
        canSubmit={customPath.length >= 2}
        onSubmit={handleInitialSubmit}
      />

      <div className="flex-1 w-full bg-background p-4 overflow-y-auto flex flex-col gap-4">
        <MatchersList
          hasSearched={hasSearched}
          matchers={matchers}
          page={page}
          totalPages={totalPages}
          onPageChange={fetchMatchers}
          onAddFriend={handleAddFriend}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors group z-50"
        onMouseDown={startResize}
      />

      {/* Confirmation Dialog */}
      {showDialog && (
        <SaveTripDialog onFinalSubmit={handleFinalSubmit} />
      )}
    </div>
  );
}
