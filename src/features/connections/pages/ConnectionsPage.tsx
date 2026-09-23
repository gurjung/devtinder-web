import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { addConnections } from "@/store/slices/connectionsSlice";
import { connectionService } from "../services/connectionService";
import type { RootState } from "@/store/store";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  CompassIcon,
  CheckIcon,
} from "@/components/common/Icons";

export const ConnectionsPage = () => {
  const connections = useSelector((store: RootState) => store.connections);
  const currentUser = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchConnections = async () => {
      try {
        const data = await connectionService.getConnections();
        dispatch(addConnections(data));
      } catch (err: unknown) {
        const status =
          (axios.isAxiosError(err) && (err.response?.status || err.status)) ||
          (err as { status?: number })?.status;
        if (status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        console.error("Failed to load connections:", err);
      }
    };

    fetchConnections();
  }, [currentUser, dispatch, navigate]);

  const filteredConnections = useMemo(() => {
    if (!connections) return [];
    if (!searchQuery.trim()) return connections;

    const query = searchQuery.toLowerCase();
    return connections.filter((conn) => {
      const name = `${conn.firstName || ""} ${conn.lastName || ""}`.toLowerCase();
      const about = (conn.about || "").toLowerCase();
      const skills = (conn.skills || []).join(" ").toLowerCase();
      return name.includes(query) || about.includes(query) || skills.includes(query);
    });
  }, [connections, searchQuery]);

  // Loading State Skeleton
  if (connections === null) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-8 bg-base-300 rounded-lg w-56 mb-2 skeleton-shimmer" />
        <div className="h-4 bg-base-200 rounded-md w-72 mb-8 skeleton-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-base-100 border border-base-200 flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-base-200 skeleton-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-base-200 rounded-md w-1/2 skeleton-shimmer" />
                <div className="h-3.5 bg-base-200 rounded-md w-1/3 skeleton-shimmer" />
                <div className="h-3.5 bg-base-200 rounded-md w-full skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Global Empty State (No Connections at all)
  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-lg shadow-primary/10">
          <UsersIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
          Your Network is Empty
        </h2>
        <p className="text-sm text-base-content/70 mt-2 max-w-sm leading-relaxed">
          Connect with other software engineers in the Feed. When you both express interest, they will appear here in your network.
        </p>
        <Link
          to="/"
          className="btn btn-primary mt-8 rounded-xl font-semibold gap-2 shadow-md shadow-primary/20"
        >
          <CompassIcon className="w-4 h-4" />
          <span>Explore Developer Feed</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-bold tracking-wider mb-1">
            <UsersIcon className="w-4 h-4" />
            <span>Developer Network</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-base-content">
              My Connections
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
              {connections.length}
            </span>
          </div>
          <p className="text-sm text-base-content/70 mt-1">
            Engineers you have successfully matched and connected with.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search by name or tech..."
            className="input input-bordered w-full pl-9 pr-8 text-sm rounded-xl"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-base-content/40 hover:text-base-content"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtered Empty State */}
      {filteredConnections.length === 0 ? (
        <div className="rounded-3xl bg-base-100 border border-base-200/90 p-12 text-center">
          <p className="text-base-content/60 text-sm">
            No connections match <span className="font-mono text-primary font-semibold">"{searchQuery}"</span>
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="btn btn-ghost btn-sm mt-3 text-xs"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Responsive Grid of Developer Connection Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConnections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;
            const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Developer";

            return (
              <div
                key={_id}
                className="group relative rounded-2xl bg-base-100 border border-base-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 hover:border-primary/30 flex items-start gap-4"
              >
                {/* Avatar with Status Ring */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-base-200 ring-2 ring-base-200 group-hover:ring-primary/40 transition-all">
                    <img
                      alt={`${fullName}'s photo`}
                      src={
                        photoUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                      }
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80";
                      }}
                    />
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-base-100"
                    title="Connected"
                  />
                </div>

                {/* Connection Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h2 className="font-bold text-base text-base-content truncate group-hover:text-primary transition-colors">
                        {fullName}
                      </h2>
                      <ShieldCheckIcon className="w-4 h-4 text-primary shrink-0" />
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-semibold shrink-0">
                      <CheckIcon className="w-3 h-3" />
                      <span>Connected</span>
                    </span>
                  </div>

                  {(age || gender) && (
                    <p className="text-xs text-base-content/50 font-mono mt-0.5 capitalize">
                      {[age ? `${age} yrs` : null, gender].filter(Boolean).join(" • ")}
                    </p>
                  )}

                  {about ? (
                    <p className="text-xs text-base-content/75 line-clamp-2 mt-2 leading-relaxed">
                      {about}
                    </p>
                  ) : (
                    <p className="text-xs text-base-content/40 italic mt-2">
                      Active software developer on DevTinder.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
