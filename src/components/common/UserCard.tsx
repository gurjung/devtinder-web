import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "@/store/slices/feedSlice";
import { requestService } from "@/features/requests/services/requestService";
import type { User } from "@/types/user";
import {
  XMarkIcon,
  HeartIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
} from "@/components/common/Icons";

export interface UserCardProps {
  user: Partial<User>;
  isPreview?: boolean;
}

// Common tech keywords to extract if skills array is empty
const COMMON_TECH = [
  "React",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Docker",
  "Kubernetes",
  "AWS",
  "Next.js",
  "Tailwind",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Vue",
  "Angular",
  "C++",
  "Java",
];

export const UserCard = ({ user, isPreview = false }: UserCardProps) => {
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);
  const [actingStatus, setActingStatus] = useState<"interested" | "ignored" | null>(null);

  if (!user) return null;

  const { _id, firstName, lastName, age, gender, about, photoUrl, skills } = user;

  const handleSendRequest = async (status: "interested" | "ignored", userId?: string) => {
    if (isPreview || !userId || actingStatus) return;
    setActingStatus(status);
    try {
      await requestService.sendConnectionRequest(status, userId);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Failed to send request:", err);
    } finally {
      setActingStatus(null);
    }
  };

  // Derive tech skills: either from user.skills or extract from bio keywords
  const displaySkills = (() => {
    if (skills && Array.isArray(skills) && skills.length > 0) {
      return skills.slice(0, 6);
    }
    if (about) {
      const found = COMMON_TECH.filter((tech) => {
        try {
          const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return new RegExp(`(^|[^a-zA-Z0-9#+])${escaped}([^a-zA-Z0-9#+]|$)`, "i").test(about);
        } catch {
          return false;
        }
      });
      if (found.length > 0) return found.slice(0, 5);
    }
    return ["Developer", "Open Source"];
  })();

  const fullName =
    ((firstName || "") + " " + (lastName || "")).trim() || "DevTinder Member";

  const initials =
    ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "DT";

  return (
    <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-base-100 border border-base-200/90 shadow-xl shadow-base-content/5 dark:shadow-black/50 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
      {/* Media / Photo Area */}
      <div className="relative w-full aspect-4/3 sm:aspect-1/1 bg-gradient-to-br from-base-200 to-base-300 overflow-hidden select-none">
        {photoUrl && !imgError ? (
          <img
            src={photoUrl}
            alt={`${fullName}'s photo`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          /* Fallback Developer Avatar */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-950/40 via-base-300 to-primary/20 text-base-content p-6">
            <div className="w-24 h-24 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-mono text-3xl font-extrabold text-primary shadow-inner mb-3">
              {initials}
            </div>
            <span className="text-xs font-mono text-base-content/60 flex items-center gap-1.5">
              <CodeBracketIcon className="w-3.5 h-3.5" />
              Developer Profile
            </span>
          </div>
        )}

        {/* Ambient Gradient Overlays for High Contrast */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-base-100 via-base-100/60 to-transparent pointer-events-none" />

        {/* Status Pill Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-100/85 backdrop-blur-md border border-base-200/70 text-xs font-medium text-base-content shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open to connect</span>
          </div>
        </div>

        {/* Preview Badge (Top Right) */}
        {isPreview && (
          <div className="absolute top-4 right-4 z-10">
            <span className="badge badge-primary badge-sm font-mono tracking-wide shadow-xs font-bold uppercase">
              Preview Mode
            </span>
          </div>
        )}
      </div>

      {/* Profile Details Content */}
      <div className="p-5 sm:p-6 -mt-8 relative z-10 flex flex-col gap-4">
        {/* Header: Name, Verified Mark & Demographics */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight text-base-content leading-tight">
              {fullName}
            </h2>
            <span title="Verified Developer">
              <ShieldCheckIcon className="w-5 h-5 text-primary shrink-0" />
            </span>
          </div>

          {(age || gender) && (
            <div className="flex items-center gap-2 mt-1.5 text-xs text-base-content/60 font-mono">
              {age && (
                <span className="px-2 py-0.5 rounded-md bg-base-200 border border-base-300">
                  {age} yrs
                </span>
              )}
              {gender && (
                <span className="px-2 py-0.5 rounded-md bg-base-200 border border-base-300 capitalize">
                  {gender}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bio / About */}
        {about ? (
          <p className="text-sm text-base-content/80 leading-relaxed line-clamp-3 font-normal">
            {about}
          </p>
        ) : (
          <p className="text-sm text-base-content/40 italic font-mono">
            No bio provided yet.
          </p>
        )}

        {/* Skills & Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {displaySkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-lg bg-base-200/80 border border-base-300/80 text-base-content/85"
            >
              <span className="text-primary opacity-60">#</span>
              {skill}
            </span>
          ))}
        </div>

        {/* Tactile Action Buttons */}
        <div className="flex items-center justify-center gap-6 pt-3 pb-1">
          {/* Pass / Ignore Button */}
          <button
            type="button"
            disabled={isPreview || !!actingStatus}
            aria-label="Pass / Ignore this developer"
            title={isPreview ? "Disabled in preview" : "Pass (Skip)"}
            className={`btn btn-circle w-14 h-14 bg-base-100 border border-base-300 shadow-md transition-all duration-200 text-base-content/60 hover:text-rose-500 hover:border-rose-400 hover:bg-rose-500/10 hover:scale-105 active:scale-95 ${
              isPreview ? "btn-disabled opacity-40 cursor-not-allowed" : ""
            }`}
            onClick={() => handleSendRequest("ignored", _id)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Interested / Connect Button */}
          <button
            type="button"
            disabled={isPreview || !!actingStatus}
            aria-label="Connect with this developer"
            title={isPreview ? "Disabled in preview" : "Connect (Interested)"}
            className={`btn btn-circle w-16 h-16 bg-gradient-to-r from-primary via-indigo-600 to-accent text-white border-0 shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-primary/40 ${
              isPreview ? "btn-disabled opacity-40 cursor-not-allowed" : ""
            }`}
            onClick={() => handleSendRequest("interested", _id)}
          >
            {actingStatus === "interested" ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <HeartIcon className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Keyboard Hints (for desktop users) */}
        {!isPreview && (
          <div className="hidden sm:flex items-center justify-center gap-3 text-[11px] font-mono text-base-content/40 pt-1">
            <span>
              <kbd className="kbd kbd-xs font-mono">←</kbd> Pass
            </span>
            <span>•</span>
            <span>
              <kbd className="kbd kbd-xs font-mono">→</kbd> Connect
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
