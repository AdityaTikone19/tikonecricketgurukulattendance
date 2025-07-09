"use client";

import LogoutModel from './LogoutModel';
import {
  GraduationCap,
  Hand,
  LayoutIcon,
  LogOutIcon,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import md5 from "blueimp-md5";

// Gravatar helper
function getGravatarUrl(email, size = 100) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

function SideNav({ onItemClick }) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutIcon, path: "/dashboard" },
    { id: 2, name: "Students", icon: GraduationCap, path: "/dashboard/students" },
    { id: 3, name: "Attendance", icon: Hand, path: "/dashboard/attendance" },
    { id: 4, name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const path = usePathname();

  useEffect(() => {
    const storedEmail = localStorage.getItem("user");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/login");
    }
  }, [router]);

  const gravatarUrl = email ? getGravatarUrl(email) : "/default-avatar.png";

  const handleLogoutConfirmed = async () => {
    setShowModal(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Section */}
      <div className="p-5 flex-shrink-0 flex justify-center">
        <Image src={"/logo.svg"} width={180} height={50} alt="logo" />
        <hr className="my-5" />
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto px-5">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id} onClick={onItemClick}>
            <h2
              className={`flex items-center gap-5 text-lg p-3 rounded-lg mb-2 my-5 ${
  path === menu.path
    ? "bg-primary text-white"
    : "text-slate-600 hover:bg-primary hover:text-white"
}`}
            >
              <menu.icon size={24} />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* User Info + Logout */}
      <div className="p-5 border-t flex-shrink-0">
        <div className="flex gap-2 items-center mb-3">
          <Image
            src={gravatarUrl}
            width={35}
            height={35}
            alt="user"
            className="rounded-full"
          />
          <div>
            <h2 className="text-sm font-bold truncate">{email?.split("@")[0]}</h2>
            <h2 className="text-xs text-slate-400 truncate">{email}</h2>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
        >
          <LogOutIcon size={16} />
          Logout
        </button>
      </div>

      <LogoutModel
        show={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogoutConfirmed}
      />
    </div>
  );
}

export default SideNav;
