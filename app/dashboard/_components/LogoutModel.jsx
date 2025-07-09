'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function LogoutModel({ show, onCancel, onConfirm }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !show) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-[90%] max-w-sm p-6 rounded-lg shadow-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Are you sure you want to logout?
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
          >
            Yes, Logout
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}