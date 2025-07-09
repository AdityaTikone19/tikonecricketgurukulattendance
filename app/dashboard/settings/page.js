"use client";

import AccountSection from "./_components/AccountSection";
import SecuritySection from "./_components/SecuritySection";
import NotificationSection from "./_components/NotificationSection";
import AppearanceSection from "./_components/AppearanceSection";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Settings</h1>

      <AccountSection />
      <SecuritySection />
      <NotificationSection />
      <AppearanceSection />
    </div>
  );
}
