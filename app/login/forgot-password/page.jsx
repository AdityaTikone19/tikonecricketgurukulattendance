"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset link sent! 📬", {
          description: data.message || "Check your email to reset your password.",
        });
      } else {
        toast.error("Error sending reset link", {
          description: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Server Error", {
        description: "Could not send reset link. Try again later.",
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
          <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>

          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              className="pl-10 pr-3 py-2 w-full rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold"
          >
            Send Reset Link
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