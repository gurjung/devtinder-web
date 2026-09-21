import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addUser } from "@/store/slices/userSlice";
import { authService } from "../services/authService";

export const AuthForm = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
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
    <div className="flex justify-center my-10 px-4">
      <div className="card bg-base-300 w-full max-w-sm shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            {!isLoginForm && (
              <>
                <label className="form-control w-full">
                  <div className="label py-1">
                    <span className="label-text font-medium">First Name</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    className="input input-bordered w-full"
                    placeholder="Jane"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label py-1">
                    <span className="label-text font-medium">Last Name</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={lastName}
                    className="input input-bordered w-full"
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </>
            )}

            <label className="form-control w-full">
              <div className="label py-1">
                <span className="label-text font-medium">Email ID</span>
              </div>
              <input
                type="email"
                required
                value={emailId}
                className="input input-bordered w-full"
                placeholder="developer@example.com"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <div className="label py-1">
                <span className="label-text font-medium">Password</span>
              </div>
              <input
                type="password"
                required
                value={password}
                className="input input-bordered w-full"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && (
              <div className="alert alert-error text-sm py-2 shadow-sm">
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions justify-center pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isLoginForm ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <p
            role="button"
            tabIndex={0}
            className="text-center text-sm link link-hover text-secondary pt-3"
            onClick={() => {
              setIsLoginForm((prev) => !prev);
              setError("");
            }}
          >
            {isLoginForm ? "New user? Sign up here" : "Existing user? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
