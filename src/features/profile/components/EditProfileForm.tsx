import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "@/store/slices/userSlice";
import { profileService } from "../services/profileService";
import UserCard from "@/components/common/UserCard";
import type { User, UserProfileEditPayload } from "@/types/user";

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
      }, 3000);
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
    <>
      <div className="flex flex-wrap justify-center items-start gap-8 my-10 px-4">
        {/* Profile Edit Card */}
        <div className="card bg-base-300 w-full max-w-sm shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl font-bold">Edit Profile</h2>

            <form onSubmit={handleSaveProfile} className="space-y-3 mt-2">
              <label className="form-control w-full">
                <div className="label py-1">
                  <span className="label-text font-medium">First Name</span>
                </div>
                <input
                  type="text"
                  required
                  value={firstName}
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <div className="label py-1">
                  <span className="label-text font-medium">Last Name</span>
                </div>
                <input
                  type="text"
                  required
                  value={lastName}
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <div className="label py-1">
                  <span className="label-text font-medium">Photo URL</span>
                </div>
                <input
                  type="url"
                  value={photoUrl}
                  className="input input-bordered w-full"
                  placeholder="https://example.com/avatar.jpg"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <div className="label py-1">
                  <span className="label-text font-medium">Age</span>
                </div>
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={age}
                  className="input input-bordered w-full"
                  placeholder="25"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <div className="label py-1">
                  <span className="label-text font-medium">Gender</span>
                </div>
                <select
                  value={gender}
                  className="select select-bordered w-full"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </label>

              <label className="form-control w-full">
                <div className="label py-1">
                  <span className="label-text font-medium">About</span>
                </div>
                <textarea
                  value={about}
                  rows={3}
                  className="textarea textarea-bordered w-full resize-none"
                  placeholder="Tell other developers about your tech stack and interests..."
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>

              {error && (
                <div className="alert alert-error text-sm py-2 shadow-sm">
                  <span>{error}</span>
                </div>
              )}

              <div className="card-actions justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold opacity-70 mb-2 uppercase tracking-wide">
            Live Preview
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
            }}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success shadow-lg">
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileForm;
