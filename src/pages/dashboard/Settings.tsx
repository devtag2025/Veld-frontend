import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import * as authApi from "@/api/auth.api";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and security
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em] mb-5">
          Account Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.name || "Admin"}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                  Name
                </p>
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                  Email
                </p>
                <p className="text-sm font-medium">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em]">
              Change Password
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-background border rounded-xl text-sm py-2.5 pl-10 pr-10 outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-background border rounded-xl text-sm py-2.5 pl-10 pr-10 outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter new password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-background border rounded-xl text-sm py-2.5 pl-10 pr-10 outline-none focus:ring-1 focus:ring-primary"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto cursor-pointer"
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
