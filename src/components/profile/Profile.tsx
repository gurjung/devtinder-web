import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store: RootState) => store.user);

  return (
    user && (
      <div>
        <EditProfile user={user} />
      </div>
    )
  );
};

export default Profile;
