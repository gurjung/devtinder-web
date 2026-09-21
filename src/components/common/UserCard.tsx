import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "@/store/slices/feedSlice";
import { requestService } from "@/features/requests/services/requestService";
import type { User } from "@/types/user";

export interface UserCardProps {
  user: Partial<User>;
  isPreview?: boolean;
}

export const UserCard = ({ user, isPreview = false }: UserCardProps) => {
  const dispatch = useDispatch();

  if (!user) return null;

  const { _id, firstName, lastName, age, gender, about, photoUrl } = user;

  const handleSendRequest = async (status: "interested" | "ignored", userId?: string) => {
    if (isPreview || !userId) return;
    try {
      await requestService.sendConnectionRequest(status, userId);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-xl relative">
      {photoUrl && (
        <figure className="h-80 w-full overflow-hidden bg-base-200">
          <img
            src={photoUrl}
            alt={`${firstName || "User"}'s avatar`}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">
            {((firstName || "") + " " + (lastName || "")).trim() || "DevTinder Member"}
          </h2>
          {isPreview && (
            <span className="badge badge-outline badge-sm opacity-60">Preview</span>
          )}
        </div>
        {age && gender && (
          <p className="text-sm opacity-80 capitalize">
            {age}, {gender}
          </p>
        )}
        {about && <p className="text-sm line-clamp-3">{about}</p>}
        <div className="card-actions justify-center my-4">
          <button
            type="button"
            disabled={isPreview}
            title={isPreview ? "Action disabled in preview mode" : undefined}
            className={`btn btn-primary ${isPreview ? "btn-disabled opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            type="button"
            disabled={isPreview}
            title={isPreview ? "Action disabled in preview mode" : undefined}
            className={`btn btn-secondary ${isPreview ? "btn-disabled opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
