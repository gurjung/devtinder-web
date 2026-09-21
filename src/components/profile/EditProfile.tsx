import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../utils/constants";
import { addUser, type User } from "../../store/slices/userSlice";
import UserCard from "../user/UserCard";

interface EditProfileProps {
  user: User;
}

const EditProfile = ({ user }: EditProfileProps) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const updateData: {
        firstName: string;
        lastName: string;
        photoUrl?: string;
        about?: string;
        age?: string | number;
        gender?: string;
      } = {
        firstName,
        lastName,
        photoUrl,
        about,
      };

      if (age) updateData.age = age;
      if (gender && gender.trim() !== "") updateData.gender = gender;

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        updateData,
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Failed to save profile",
        );
      } else {
        setError("Failed to save profile");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center my-10 pb-20">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name:</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Last Name:</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Photo URL :</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Age:</span>
                  </div>
                  <input
                    type="text"
                    value={age}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Gender:</span>
                  </div>
                  <div className="dropdown dropdown-bottom w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="select select-bordered w-full flex items-center justify-between font-normal"
                    >
                      {gender
                        ? gender.charAt(0).toUpperCase() + gender.slice(1)
                        : "Select Gender"}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-10 w-full p-2 shadow-lg border border-base-200 mt-1"
                    >
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setGender("male");
                            (document.activeElement as HTMLElement)?.blur();
                          }}
                        >
                          Male
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setGender("female");
                            (document.activeElement as HTMLElement)?.blur();
                          }}
                        >
                          Female
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setGender("others");
                            (document.activeElement as HTMLElement)?.blur();
                          }}
                        >
                          Others
                        </button>
                      </li>
                    </ul>
                  </div>
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">About:</span>
                  </div>
                  <textarea
                    value={about}
                    className="textarea textarea-bordered w-full max-w-xs h-24 resize-none"
                    placeholder="Tell us about yourself..."
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </label>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
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
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
