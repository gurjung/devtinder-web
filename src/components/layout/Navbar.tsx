import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "@/store/slices/userSlice";
import { authService } from "@/features/auth/services/authService";
import type { RootState } from "@/store/store";

export const Navbar = () => {
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      dispatch(removeUser());
      navigate("/login");
    }
  };

  return (
    <header className="navbar bg-base-300 shadow-sm px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          👩‍💻 DevTinder
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="font-medium text-sm">Welcome, {user.firstName}</div>
          <div className="dropdown dropdown-end mx-2 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              aria-label="User profile menu"
            >
              <div className="w-10 rounded-full ring-1 ring-primary/30">
                <img
                  alt={`${user.firstName}'s photo`}
                  src={
                    user.photoUrl ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-20 mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge badge-sm badge-secondary">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/premium">Premium</Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-error"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
