import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm";
import type { RootState } from "@/store/store";

export const ProfilePage = () => {
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-8 bg-base-300 rounded-lg w-48 mb-2 skeleton-shimmer" />
        <div className="h-4 bg-base-200 rounded-md w-72 mb-8 skeleton-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 rounded-3xl bg-base-200 skeleton-shimmer" />
          <div className="lg:col-span-5 h-96 rounded-3xl bg-base-200 skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return <EditProfileForm user={user} />;
};

export default ProfilePage;
