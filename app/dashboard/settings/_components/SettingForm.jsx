"use client";

import ProfileSection from "./ProfileSection";
import SecuritySection from "./SecuritySection";
import AppearanceSection from "./AppearanceSection";
import NotificationSection from "./NotificationSection";
import AccountSection from "./AccountSection";

export default function SettingForm() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Settings
      </h1>

      {/* Profile Info */}
      <ProfileSection />

      {/* Security Settings */}
      <SecuritySection />

      {/* Appearance Settings */}
      <AppearanceSection />

      {/* Notification Preferences */}
      <NotificationSection />

      {/* Account Actions */}
      <AccountSection />
    </div>
  );
}