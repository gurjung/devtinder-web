import { useSelector } from "react-redux";
import EditProfileForm from "../components/EditProfileForm";
import type { RootState } from "@/store/store";

export const ProfilePage = () => {
  const user = useSelector((store: RootState) => store.user);

  if (!user) {
    return (
      <div className="flex justify-center my-20">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return <EditProfileForm user={user} />;
};

export default ProfilePage;
