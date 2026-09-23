import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "@/store/slices/userSlice";
import { authService } from "@/features/auth/services/authService";
import type { RootState } from "@/store/store";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  CompassIcon,
  UsersIcon,
  InboxIcon,
  UserCircleIcon,
  DevTinderLogo,
} from "@/components/common/Icons";

export const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((store: RootState) => store.user);
  const connections = useSelector((store: RootState) => store.connections);
  const requests = useSelector((store: RootState) => store.requests);

  const isPublicRoute = location.pathname === "/login";
  const [sessionChecked, setSessionChecked] = useState(false);

  const fetchSessionUser = useCallback(async () => {
    if (currentUser || isPublicRoute) return;

    try {
      const user = await authService.getCurrentUser();
      dispatch(addUser(user));
    } catch (err: unknown) {
      const status =
        (axios.isAxiosError(err) && (err.response?.status || err.status)) ||
        (err as { status?: number })?.status;
      if (status === 401) {
        navigate("/login", { replace: true });
      }
      console.error("Session verification error:", err);
    } finally {
      setSessionChecked(true);
    }
  }, [currentUser, isPublicRoute, dispatch, navigate]);

  useEffect(() => {
    if (!currentUser && !isPublicRoute) {
      fetchSessionUser();
    }
  }, [currentUser, isPublicRoute, fetchSessionUser]);

  const isVerifyingSession = !currentUser && !isPublicRoute && !sessionChecked;

  const mobileNavItems = [
    { to: "/", label: "Discover", icon: CompassIcon, count: null },
    {
      to: "/connections",
      label: "Network",
      icon: UsersIcon,
      count: connections?.length || null,
    },
    {
      to: "/requests",
      label: "Requests",
      icon: InboxIcon,
      count: requests?.length || null,
    },
    { to: "/profile", label: "Profile", icon: UserCircleIcon, count: null },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content relative transition-colors duration-200">
      {/* Subtle Developer Background Ambient Grid */}
      <div
        className="fixed inset-0 dev-grid-bg opacity-[0.035] dark:opacity-[0.05] pointer-events-none z-0"
        aria-hidden="true"
      />

      <Navbar />

      <main className="flex-1 relative z-10 pb-24 md:pb-12">
        {isVerifyingSession ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <DevTinderLogo className="w-8 h-8" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-base-content/50">
              <span className="loading loading-spinner loading-xs text-primary" />
              <span>Verifying session...</span>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />

      {/* Mobile Bottom Navigation Bar (Active only when logged in) */}
      {currentUser && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-100/90 backdrop-blur-md border-t border-base-200/80 px-4 py-2">
          <nav className="flex items-center justify-around" aria-label="Mobile Navigation">
            {mobileNavItems.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.count !== null && item.count > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-primary text-primary-content text-[9px] font-mono font-bold flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-primary absolute -bottom-0.5" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
