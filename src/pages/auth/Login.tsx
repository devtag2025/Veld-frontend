import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import * as authApi from "@/api/auth.api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await login({ email, password });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setForgotLoading(true);
      await authApi.forgotPassword(forgotEmail);
      toast.success("If an account with that email exists, a reset link has been sent.");
      setShowForgot(false);
      setForgotEmail("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send reset email");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="mt-2 text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={() => { setShowForgot(true); setForgotEmail(email); }}
              className="font-medium text-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {/* <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </a>
        </p> */}
      </form>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-full max-w-sm shadow-xl mx-4 space-y-4">
            <div>
              <h3 className="text-lg font-bold">Forgot Password</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="px-4 py-2 text-sm rounded-md border hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;