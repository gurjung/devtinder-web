import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "@/store/slices/userSlice";
import { authService } from "@/features/auth/services/authService";
import type { RootState } from "@/store/store";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((store: RootState) => store.user);

  const fetchSessionUser = useCallback(async () => {
    if (currentUser) return;
    try {
      const user = await authService.getCurrentUser();
      dispatch(addUser(user));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate("/login");
      }
      console.error("Session verification error:", err);
    }
  }, [currentUser, dispatch, navigate]);

  useEffect(() => {
    fetchSessionUser();
  }, [fetchSessionUser]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
