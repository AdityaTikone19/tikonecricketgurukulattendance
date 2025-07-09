"use client";

import { useEffect, useState } from "react";

export default function NotificationSection() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch("/api/get-notifications");
        const data = await res.json();

        if (res.ok) {
          setEmailNotifications(data.email);
          setPushNotifications(data.push);
          setSmsNotifications(data.sms);
        }
      } catch (err) {
        console.error("Error loading preferences", err);
      }
    };

    fetchPrefs();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/update-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailNotifications,
          push: pushNotifications,
          sms: smsNotifications,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Notification preferences saved.");
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      alert("❌ Failed to save preferences.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Notifications</h2>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            className="h-4 w-4"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Push Notifications</span>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
            className="h-4 w-4"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>SMS Notifications</span>
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={() => setSmsNotifications(!smsNotifications)}
            className="h-4 w-4"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
