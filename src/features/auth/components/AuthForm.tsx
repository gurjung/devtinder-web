import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "@/store/slices/userSlice";
import { authService } from "../services/authService";
import {
  DevTinderLogo,
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@/components/common/Icons";

export const AuthForm = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginForm) {
        const user = await authService.login({ emailId, password });
        dispatch(addUser(user));
        navigate("/");
      } else {
        const user = await authService.signup({ firstName, lastName, emailId, password });
        dispatch(addUser(user));
        navigate("/profile");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : (err.response.data as { message?: string }).message || "Authentication failed",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <DevTinderLogo className="w-12 h-12 shadow-lg shadow-primary/20 rounded-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-base-content">
            {isLoginForm ? "Welcome back" : "Create developer account"}
          </h1>
          <p className="text-sm text-base-content/70 mt-2">
            {isLoginForm
              ? "Discover and collaborate with developers worldwide"
              : "Join the developer discovery network today"}
          </p>

          {/* Value Proposition Pills */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-mono text-base-content/60">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-200/80 border border-base-300">
              <SparklesIcon className="w-3 h-3 text-primary" />
              <span>Smart Match</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-200/80 border border-base-300">
              <ShieldCheckIcon className="w-3 h-3 text-emerald-500" />
              <span>Verified Devs</span>
            </span>
          </div>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl bg-base-100 border border-base-200/90 shadow-2xl shadow-base-content/5 p-6 sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-base-200/70 rounded-2xl mb-6 border border-base-200">
            <button
              type="button"
              onClick={() => {
                setIsLoginForm(true);
                setError("");
              }}
              className={`py-2 text-sm font-semibold rounded-xl transition-all ${
                isLoginForm
                  ? "bg-base-100 text-primary shadow-xs"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginForm(false);
                setError("");
              }}
              className={`py-2 text-sm font-semibold rounded-xl transition-all ${
                !isLoginForm
                  ? "bg-base-100 text-primary shadow-xs"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name for Sign Up */}
            {!isLoginForm && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={firstName}
                      placeholder="Jane"
                      className="input input-bordered w-full pl-9 text-sm rounded-xl"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <UserCircleIcon className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content/80">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={lastName}
                      placeholder="Doe"
                      className="input input-bordered w-full pl-9 text-sm rounded-xl"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <UserCircleIcon className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-base-content/80">
                Developer Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailId}
                  placeholder="developer@example.com"
                  className="input input-bordered w-full pl-9 text-sm rounded-xl font-mono"
                  onChange={(e) => setEmailId(e.target.value)}
                />
                <EnvelopeIcon className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-base-content/80">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-9 pr-10 text-sm rounded-xl font-mono"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <LockClosedIcon className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Feedback */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-xl font-semibold shadow-md shadow-primary/20 text-white"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isLoginForm ? (
                  "Sign In to DevTinder"
                ) : (
                  "Create Account & Start Matching"
                )}
              </button>
            </div>
          </form>

          {/* Toggle Helper Link */}
          <div className="text-center pt-5 border-t border-base-200/80 mt-6">
            <button
              type="button"
              className="text-xs text-base-content/70 hover:text-primary transition-colors cursor-pointer"
              onClick={() => {
                setIsLoginForm((prev) => !prev);
                setError("");
              }}
            >
              {isLoginForm ? (
                <span>
                  New to DevTinder?{" "}
                  <strong className="text-primary font-semibold">Sign up for free</strong>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <strong className="text-primary font-semibold">Sign in here</strong>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
