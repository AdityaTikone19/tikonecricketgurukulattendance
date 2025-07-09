"use client";

import { useState, useEffect } from "react";

export default function AccountSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("user");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setLoading(false);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("✅ Account updated successfully!");
        localStorage.setItem("user", email);
      } else {
        const err = await res.json();
        setMessage("❌ " + (err.error || "Update failed."));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 w-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Account Info</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded-md text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Account
        </button>

        {message && (
          <p className="text-sm mt-2 break-words text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}