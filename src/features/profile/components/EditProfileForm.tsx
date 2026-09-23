import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "@/store/slices/userSlice";
import { profileService } from "../services/profileService";
import UserCard from "@/components/common/UserCard";
import type { User, UserProfileEditPayload } from "@/types/user";
import {
  CheckIcon,
  SparklesIcon,
  CodeBracketIcon,
} from "@/components/common/Icons";

export interface EditProfileFormProps {
  user: User;
}

export const EditProfileForm = ({ user }: EditProfileFormProps) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age?.toString() || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: UserProfileEditPayload = {
        firstName,
        lastName,
        photoUrl,
        about,
      };

      if (age) payload.age = age;
      if (gender && gender.trim() !== "") payload.gender = gender;

      const updatedUser = await profileService.editProfile(payload);
      dispatch(addUser(updatedUser));
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : (err.response.data as { message?: string }).message || "Failed to update profile",
        );
      } else {
        setError("Failed to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-bold tracking-wider mb-1">
          <CodeBracketIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
          Developer Persona
        </h1>
        <p className="text-sm text-base-content/70 mt-1">
          Manage how other engineers see your skills, experience, and bio on DevTinder.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor (7 cols on lg) */}
        <div className="lg:col-span-7 rounded-3xl bg-base-100 border border-base-200/90 shadow-xl shadow-base-content/5 p-6 sm:p-8">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Section 1: Names */}
            <div>
              <h2 className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono mb-3">
                1. Basic Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    placeholder="Alex"
                    className="input input-bordered w-full text-sm rounded-xl"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    placeholder="River"
                    className="input input-bordered w-full text-sm rounded-xl"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Avatar & Media */}
            <div>
              <h2 className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono mb-3">
                2. Avatar &amp; Photo
              </h2>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-base-content/80">
                  Profile Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-base-200 border border-base-300 overflow-hidden shrink-0 flex items-center justify-center">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80";
                        }}
                      />
                    ) : (
                      <span className="font-mono text-xs text-base-content/40">URL</span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={photoUrl}
                    placeholder="https://example.com/your-photo.jpg"
                    className="input input-bordered flex-1 text-sm rounded-xl font-mono text-xs"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-base-content/50">
                  Provide a direct link to an image (e.g. GitHub avatar, Gravatar, Unsplash).
                </p>
              </div>
            </div>

            {/* Section 3: Demographics */}
            <div>
              <h2 className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono mb-3">
                3. Developer Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="120"
                    value={age}
                    placeholder="25"
                    className="input input-bordered w-full text-sm rounded-xl font-mono"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    Gender
                  </label>
                  <select
                    value={gender}
                    className="select select-bordered w-full text-sm rounded-xl"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Bio / About & Tech Stack */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-base-content/50 uppercase tracking-wider font-mono">
                  4. About &amp; Tech Stack
                </h2>
                <span className="text-[10px] font-mono text-base-content/40">
                  {about.length} chars
                </span>
              </div>
              <div className="space-y-1.5">
                <textarea
                  value={about}
                  rows={4}
                  className="textarea textarea-bordered w-full resize-none text-sm rounded-xl leading-relaxed"
                  placeholder="Senior Full Stack Engineer building high-scale distributed apps. Passionate about React, TypeScript, Node.js, and cloud systems..."
                  onChange={(e) => setAbout(e.target.value)}
                />
                <p className="text-[11px] text-base-content/50 leading-normal">
                  <strong className="text-primary font-medium">Pro-tip:</strong> Mention keywords like React, Node.js, TypeScript, Go, or Python to automatically highlight skill tags on your card!
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-xl font-semibold shadow-md shadow-primary/20 text-white"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Live Preview (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
          <div className="w-full max-w-sm flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-base-content/70 uppercase tracking-wide">
              <SparklesIcon className="w-3.5 h-3.5 text-primary" />
              <span>Live Card Preview</span>
            </div>
            <span className="text-[11px] font-mono text-base-content/40">
              Interactive
            </span>
          </div>

          <UserCard
            isPreview={true}
            user={{
              _id: user._id,
              firstName,
              lastName,
              photoUrl,
              age,
              gender,
              about,
              skills: user.skills,
            }}
          />
        </div>
      </div>

      {/* Modern Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-base-100 text-base-content border border-emerald-500/40 shadow-2xl shadow-emerald-500/10">
            <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-semibold">
              Profile updated successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileForm;
