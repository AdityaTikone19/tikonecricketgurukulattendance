"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePassword = (pass) => {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /[0-9]/.test(pass)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Weak password", {
        description:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      });
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        toast.success("✅ Password reset successfully!", {
          description: "You will be redirected to login.",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const { error } = await res.json();
        toast.error("Reset failed", {
          description: error || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <Image src="/logo.svg" alt="logo" width={160} height={80} className="rounded-2xl" />
      </div>

      <div className="blob absolute -z-10 top-0 left-0 w-full h-full bg-purple-100 rounded-full blur-3xl opacity-40" />

      <div className="bg-gray-700 text-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-sm mt-28">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

          <div className="relative mb-4">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              className="pl-10 pr-3 py-2 w-full rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative mb-4">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              className="pl-10 pr-3 py-2 w-full rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-md font-semibold"
          >
            Set New Password
          </button>
        </form>
      </div>

      <footer className="text-center text-xs text-gray-400 mt-8 px-4">
        <p><b>© Tikone Cricket Academy | All Rights Reserved.</b></p>
        <p>Designed & Developed By <b>Aditya Tikone</b>.</p>
      </footer>
    </div>
  );
}