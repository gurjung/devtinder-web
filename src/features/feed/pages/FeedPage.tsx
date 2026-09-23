import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { addFeed, removeUserFromFeed } from "@/store/slices/feedSlice";
import { feedService } from "../services/feedService";
import { requestService } from "@/features/requests/services/requestService";
import UserCard from "@/components/common/UserCard";
import type { RootState } from "@/store/store";
import {
  CompassIcon,
  UsersIcon,
  SparklesIcon,
  ArrowPathIcon,
  UserCircleIcon,
} from "@/components/common/Icons";

export const FeedPage = () => {
  const feed = useSelector((store: RootState) => store.feed);
  const currentUser = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchFeed = useCallback(async () => {
    try {
      const users = await feedService.getFeed();
      dispatch(addFeed(users));
    } catch (err: unknown) {
      const status =
        (axios.isAxiosError(err) && (err.response?.status || err.status)) ||
        (err as { status?: number })?.status;
      if (status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      console.error("Failed to load feed:", err);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }
    if (feed === null) {
      fetchFeed();
    }
  }, [currentUser, feed, fetchFeed, navigate]);

  // Keyboard navigation: Left Arrow (Ignore) / Right Arrow (Interested)
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (!feed || feed.length === 0 || !feed[0]?._id) return;
      const targetUserId = feed[0]._id;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        try {
          await requestService.sendConnectionRequest("ignored", targetUserId);
          dispatch(removeUserFromFeed(targetUserId));
        } catch (err) {
          console.error("Failed to ignore user via keyboard:", err);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        try {
          await requestService.sendConnectionRequest("interested", targetUserId);
          dispatch(removeUserFromFeed(targetUserId));
        } catch (err) {
          console.error("Failed to express interest via keyboard:", err);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, feed]);

  // Loading State: High-fidelity Developer Skeleton Card
  if (feed === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-8">
        <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-base-100 border border-base-200/80 shadow-xl overflow-hidden animate-pulse">
          {/* Media Skeleton */}
          <div className="w-full aspect-4/3 sm:aspect-1/1 bg-base-300 skeleton-shimmer" />

          {/* Body Skeleton */}
          <div className="p-6 space-y-4">
            <div className="h-7 bg-base-300 rounded-lg w-2/3 skeleton-shimmer" />
            <div className="h-4 bg-base-200 rounded-md w-1/3 skeleton-shimmer" />
            <div className="space-y-2 pt-2">
              <div className="h-3.5 bg-base-200 rounded-md w-full skeleton-shimmer" />
              <div className="h-3.5 bg-base-200 rounded-md w-5/6 skeleton-shimmer" />
            </div>
            {/* Badges Skeleton */}
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-16 bg-base-200 rounded-md skeleton-shimmer" />
              <div className="h-6 w-20 bg-base-200 rounded-md skeleton-shimmer" />
              <div className="h-6 w-14 bg-base-200 rounded-md skeleton-shimmer" />
            </div>
            {/* Buttons Skeleton */}
            <div className="flex justify-center gap-6 pt-4">
              <div className="w-14 h-14 rounded-full bg-base-200 skeleton-shimmer" />
              <div className="w-16 h-16 rounded-full bg-base-300 skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State: Radar Radar-Ping Experience
  if (feed.length === 0 || !feed[0]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-12 text-center">
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Radar Waves */}
          <div className="absolute inset-0 rounded-full border border-primary/20 radar-ping" />
          <div
            className="absolute inset-4 rounded-full border border-primary/30 radar-ping"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute inset-8 rounded-full border border-primary/40 radar-ping"
            style={{ animationDelay: "2s" }}
          />

          {/* Central Radar Node */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-primary/30 z-10">
            <CompassIcon className="w-8 h-8" />
          </div>
        </div>

        <div className="max-w-md space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Feed Exhausted</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
            You're all caught up!
          </h2>
          <p className="text-sm text-base-content/70 leading-relaxed">
            There are no more developers in your immediate queue right now. Refresh
            the feed to check for new registrations or browse your existing network.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={fetchFeed}
            className="btn btn-primary btn-sm sm:btn-md gap-2 rounded-xl shadow-md shadow-primary/20"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Check for New Devs</span>
          </button>
          <Link
            to="/connections"
            className="btn btn-outline btn-sm sm:btn-md gap-2 rounded-xl"
          >
            <UsersIcon className="w-4 h-4" />
            <span>My Connections</span>
          </Link>
          <Link
            to="/profile"
            className="btn btn-ghost btn-sm sm:btn-md gap-2 rounded-xl text-base-content/70"
          >
            <UserCircleIcon className="w-4 h-4" />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>
    );
  }

  // Active Feed: Developer Card in Focused Layout
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-8 sm:py-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default FeedPage;
