import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { removeUser } from "@/store/slices/userSlice";
import { authService } from "@/features/auth/services/authService";
import type { RootState } from "@/store/store";
import {
  DevTinderLogo,
  CompassIcon,
  UsersIcon,
  InboxIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@/components/common/Icons";
import ThemeToggle from "@/components/common/ThemeToggle";

export const Navbar = () => {
  const user = useSelector((store: RootState) => store.user);
  const connections = useSelector((store: RootState) => store.connections);
  const requests = useSelector((store: RootState) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  const navLinks = [
    {
      to: "/",
      label: "Discover",
      icon: CompassIcon,
      count: null,
    },
    {
      to: "/connections",
      label: "Connections",
      icon: UsersIcon,
      count: connections && connections.length > 0 ? connections.length : null,
    },
    {
      to: "/requests",
      label: "Requests",
      icon: InboxIcon,
      count: requests && requests.length > 0 ? requests.length : null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-base-200/80 bg-base-100/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform duration-150 active:scale-95"
            aria-label="DevTinder Home"
          >
            <DevTinderLogo className="w-8 h-8 transition-transform duration-200 group-hover:scale-105 shadow-sm shadow-indigo-500/20" />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent">
                DevTinder
              </span>
              <span className="text-[10px] font-mono font-medium tracking-wider text-base-content/50 uppercase leading-none hidden sm:inline">
                Dev Networking
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation Links (Desktop) */}
        {user && (
          <nav
            className="hidden md:flex items-center gap-1 bg-base-200/60 p-1 rounded-xl border border-base-200"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-base-100 text-primary shadow-xs font-semibold"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-100/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "opacity-70"}`} />
                  <span>{link.label}</span>
                  {link.count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                        isActive
                          ? "bg-primary text-primary-content"
                          : "bg-base-300 text-base-content/80"
                      }`}
                    >
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Action Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher */}
          <ThemeToggle />

          {/* User Profile or Sign In */}
          {user ? (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                role="button"
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-base-200/80 transition-colors border border-transparent hover:border-base-200 text-left"
                aria-label="User profile and account settings"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/40 bg-base-300">
                    <img
                      alt={`${user.firstName}'s photo`}
                      src={
                        user.photoUrl ||
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
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-base-100"
                    title="Online"
                  />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {user.firstName}
                  </span>
                  <span className="text-[10px] text-base-content/50 leading-tight">
                    Developer
                  </span>
                </div>
              </button>

              <div
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-2xl z-50 mt-2 w-64 p-2.5 shadow-xl border border-base-200 divide-y divide-base-200/60"
              >
                {/* User Summary Card */}
                <div className="px-3 py-2 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-base-300 ring-1 ring-base-300">
                      <img
                        alt={user.firstName}
                        src={
                          user.photoUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm truncate">
                          {user.firstName} {user.lastName}
                        </span>
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                      </div>
                      <p className="text-xs text-base-content/60 truncate font-mono">
                        {user.emailId || user.email || "developer@devtinder.io"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dropdown Navigation Links */}
                <ul className="py-1.5 space-y-0.5">
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center justify-between py-2 px-3 rounded-lg text-sm hover:bg-base-200/70"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCircleIcon className="w-4 h-4 text-base-content/70" />
                        <span>Edit Profile</span>
                      </div>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        Edit
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connections"
                      className="flex items-center justify-between py-2 px-3 rounded-lg text-sm hover:bg-base-200/70"
                    >
                      <div className="flex items-center gap-2.5">
                        <UsersIcon className="w-4 h-4 text-base-content/70" />
                        <span>My Connections</span>
                      </div>
                      {connections && connections.length > 0 && (
                        <span className="badge badge-sm badge-ghost font-mono">
                          {connections.length}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requests"
                      className="flex items-center justify-between py-2 px-3 rounded-lg text-sm hover:bg-base-200/70"
                    >
                      <div className="flex items-center gap-2.5">
                        <InboxIcon className="w-4 h-4 text-base-content/70" />
                        <span>Connection Requests</span>
                      </div>
                      {requests && requests.length > 0 && (
                        <span className="badge badge-sm badge-primary font-mono">
                          {requests.length}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>

                {/* Logout Button */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-sm px-4 rounded-xl shadow-xs font-semibold"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
