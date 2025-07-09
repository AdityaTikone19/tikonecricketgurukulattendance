"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import md5 from "blueimp-md5";
import { useRouter } from "next/navigation";
import { MenuIcon, X } from "lucide-react";
import SideNav from "./SideNav";
import { motion, AnimatePresence } from "framer-motion";

function getGravatarUrl(email, size = 100) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

function Header() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("user");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/login");
    }
  }, [router]);

  const gravatarUrl = email ? getGravatarUrl(email) : "/default-avatar.png";

  async function handleLogoutConfirmed() {
    setShowModal(false);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <>
      <div className="p-4 shadow-sm border flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="flex items-center gap-4">
          {/* Hamburger icon - mobile only */}
          <button
            className="md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <h1 className="text-2xl font-bold text-primary font-serif">
            Tikone Cricket Gurukul
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={gravatarUrl}
            alt="Gravatar"
            width={35}
            height={35}
            className="rounded-full"
          />
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center p-10 justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogoutConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Mobile Sidebar Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />

            {/* SideNav Drawer */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg p-4"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-gray-600"
                >
                  <X />
                </button>
              </div>
              <SideNav onItemClick={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;