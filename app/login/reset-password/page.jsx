import { Suspense } from "react";
import ResetPassword from "./ResetPassword";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}