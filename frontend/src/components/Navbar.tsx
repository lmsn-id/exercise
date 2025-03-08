"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHiddenNavbar } from "~/hook/useTools";
import { Session } from "next-auth";
import Logout from "./Logout";

interface SessionProp {
  session: Session | null;
}

export default function Navbar({ session }: SessionProp) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const checkScreenSize = () => {
    if (typeof window !== "undefined") {
      setIsOpen(window.innerWidth >= 768);
    }
  };

  useEffect(() => {
    setIsOpen(window.innerWidth >= 768);
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (useHiddenNavbar()) {
    return null;
  }

  const ComponentPlus = () => {
    if (session?.user?.role === "superadmin") {
      return (
        <li>
          <Link
            href="/superadmin"
            className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700  md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-black"
          >
            Admin
          </Link>
        </li>
      );
    }

    if (session?.user?.role === "siswa") {
      return (
        <li>
          <Link
            href="/e-learning"
            className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700  md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-black"
          >
            E-Learning
          </Link>
        </li>
      );
    }

    if (
      session?.user?.role === "Guru" ||
      session?.user?.role === "Kepala Sekolah"
    ) {
      return (
        <li>
          <Link
            href="/akademik"
            className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700  md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-black"
          >
            Akademik
          </Link>
        </li>
      );
    }

    return null;
  };

  return (
    <nav className=" sticky top-0 z-50 border-gray-300 bg-blue-800 text-white md:shadow-lg">
      <div className="w-full bg-blue-900 p-3">
        <div className="container mx-auto flex justify-end px-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-yellow-400">
                Corporate Page
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-yellow-400">
                Career
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-yellow-400">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
          <Link
            href="https://flowbite.com/"
            className="flex items-center space-x-3"
          >
            <Image
              src="/image/Logo.webp"
              alt="LMSN Logo"
              width={40}
              height={40}
            />
            <span className="self-center whitespace-nowrap text-2xl font-bold text-white">
              LMSN
            </span>
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-controls="navbar-default"
            aria-expanded={isOpen ? true : false}
            onClick={toggleNavbar}
          >
            <span className="sr-only">Open main menu</span>
            <div className="space-y-1.5">
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>

          <div
            id="navbar-default"
            className={`absolute left-0 top-full z-50 w-full transform bg-blue-700 transition-all duration-500 ease-in-out md:relative md:z-auto md:flex md:w-auto md:items-center md:bg-transparent ${
              isOpen
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <ul className=" flex flex-col items-center border border-gray-700 bg-blue-700 p-4 font-medium md:mt-0 md:flex-row md:items-center md:space-x-8 md:border-0 md:bg-transparent md:p-0">
              <li>
                <Link
                  href="/"
                  className="block rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-purple-400 hover:text-gray-900 md:bg-transparent md:p-0 md:hover:bg-transparent md:hover:text-black"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700  md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-black"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700  md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-black"
                >
                  Information
                </Link>
              </li>
              {session ? (
                <>
                  <ComponentPlus />
                  <li>
                    <div className="flex w-full justify-center text-white rounded hover:text-black">
                      <Logout className="block rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700  md:border-0 md:p-0 md:hover:bg-transparentmd:hover:text-black" />
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/auth/login"
                    className="block py-2 px-3 text-white rounded md:hover:text-black"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
