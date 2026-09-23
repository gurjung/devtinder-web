import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import AuthForm from "../components/AuthForm";

export const LoginPage = () => {
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return <AuthForm />;
};

export default LoginPage;
