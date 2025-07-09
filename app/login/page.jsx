"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LockIcon, Mail } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const baseURL = process.env.NEXT_PUBLIC_APP_URL;
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Welcome back, ${data.user?.name || "User"}! 🎉`, {
          description: "Login successful. Redirecting to dashboard...",
          duration: 3000,
        });

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", email);

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error("Login failed", {
          description: data.error || "Invalid credentials",
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
        <Image
          src="/logo.svg"
          alt="logo"
          width={160}
          height={80}
          className="rounded-2xl mx-auto"
        />
      </div>

      <div className="blob absolute -z-10 top-0 left-0 w-full h-full bg-purple-100 rounded-full blur-3xl opacity-40" />

      <div className="bg-gray-700 text-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-sm mt-28">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              className="pl-10 pr-3 py-2 w-full rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative mb-4">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              className="pl-10 pr-3 py-2 w-full rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-500" />
              Remember Me
            </label>
            <a
              href="/login/forgot-password"
              className="text-blue-300 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold"
          >
            Login
          </button>

          <div className="text-center text-sm mt-4">
            {/* Sign Up Link (optional) */}
          </div>
        </form>
      </div>

      <footer className="text-center text-xs text-gray-400 mt-8">
        <p>© Tikone Cricket Academy | All Rights Reserved.</p>
        <p>Designed & Developed by <b>Aditya Tikone</b>.</p>
      </footer>
    </div>
  );
}