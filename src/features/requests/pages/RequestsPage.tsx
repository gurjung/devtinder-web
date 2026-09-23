import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { addRequests, removeRequest } from "@/store/slices/requestSlice";
import { requestService } from "../services/requestService";
import type { RootState } from "@/store/store";
import {
  InboxIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  CompassIcon,
} from "@/components/common/Icons";

export const RequestsPage = () => {
  const requests = useSelector((store: RootState) => store.requests);
  const currentUser = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchRequests = async () => {
      try {
        const data = await requestService.getReceivedRequests();
        dispatch(addRequests(data));
      } catch (err: unknown) {
        const status =
          (axios.isAxiosError(err) && (err.response?.status || err.status)) ||
          (err as { status?: number })?.status;
        if (status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        console.error("Failed to load requests:", err);
      }
    };

    fetchRequests();
  }, [currentUser, dispatch, navigate]);

  const handleReview = async (status: "accepted" | "rejected", requestId: string) => {
    setActingId(requestId);
    try {
      await requestService.reviewRequest(status, requestId);
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(`Failed to ${status} request:`, err);
    } finally {
      setActingId(null);
    }
  };

  // Loading State Skeleton
  if (requests === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-8 bg-base-300 rounded-lg w-56 mb-2 skeleton-shimmer" />
        <div className="h-4 bg-base-200 rounded-md w-72 mb-8 skeleton-shimmer" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-base-100 border border-base-200 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-14 h-14 rounded-2xl bg-base-200 skeleton-shimmer shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-base-200 rounded-md w-40 skeleton-shimmer" />
                  <div className="h-3.5 bg-base-200 rounded-md w-24 skeleton-shimmer" />
                  <div className="h-3.5 bg-base-200 rounded-md w-64 skeleton-shimmer" />
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <div className="w-20 h-9 rounded-xl bg-base-200 skeleton-shimmer" />
                <div className="w-20 h-9 rounded-xl bg-base-300 skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Inbox Zero Empty State
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/10">
          <InboxIcon className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold mb-3">
          <CheckIcon className="w-3.5 h-3.5" />
          <span>Inbox Zero</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
          No Pending Requests
        </h2>
        <p className="text-sm text-base-content/70 mt-2 max-w-sm leading-relaxed">
          You're all caught up! You have responded to all received invitations. Discover more developers in your feed to grow your network.
        </p>
        <Link
          to="/"
          className="btn btn-primary mt-8 rounded-xl font-semibold gap-2 shadow-md shadow-primary/20"
        >
          <CompassIcon className="w-4 h-4" />
          <span>Find Developers to Connect</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-bold tracking-wider mb-1">
          <InboxIcon className="w-4 h-4" />
          <span>Incoming Invites</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-base-content">
            Connection Requests
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
            {requests.length}
          </span>
        </div>
        <p className="text-sm text-base-content/70 mt-1">
          Review developers who have sent you an invitation to connect.
        </p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => {
          const sender = request.fromUserId;
          if (!sender) return null;

          const isActing = actingId === request._id;
          const fullName = `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || "Developer";

          return (
            <div
              key={request._id}
              className="rounded-2xl bg-base-100 border border-base-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 hover:border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            >
              {/* Sender Info */}
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-base-200 shrink-0 ring-2 ring-base-200">
                  <img
                    alt={`${fullName}'s photo`}
                    src={
                      sender.photoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                    }
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80";
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-bold text-base text-base-content truncate">
                      {fullName}
                    </h2>
                    <ShieldCheckIcon className="w-4 h-4 text-primary shrink-0" />
                  </div>

                  {(sender.age || sender.gender) && (
                    <p className="text-xs text-base-content/50 font-mono mt-0.5 capitalize">
                      {[sender.age ? `${sender.age} yrs` : null, sender.gender].filter(Boolean).join(" • ")}
                    </p>
                  )}

                  {sender.about ? (
                    <p className="text-xs text-base-content/75 line-clamp-2 mt-1.5 leading-relaxed">
                      {sender.about}
                    </p>
                  ) : (
                    <p className="text-xs text-base-content/40 italic mt-1.5">
                      Interested in connecting with you on DevTinder.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-base-200">
                <button
                  type="button"
                  disabled={isActing}
                  aria-label="Decline request"
                  className="btn btn-ghost btn-sm text-rose-500 hover:bg-rose-500/10 rounded-xl gap-1.5 flex-1 sm:flex-initial"
                  onClick={() => handleReview("rejected", request._id)}
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Decline</span>
                </button>

                <button
                  type="button"
                  disabled={isActing}
                  aria-label="Accept request"
                  className="btn btn-primary btn-sm rounded-xl font-semibold shadow-xs gap-1.5 flex-1 sm:flex-initial text-white"
                  onClick={() => handleReview("accepted", request._id)}
                >
                  {isActing ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>Accept</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestsPage;
