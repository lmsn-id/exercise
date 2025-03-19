"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHiddenNavbar } from "~/hook/useTools";
import Icon from "./Icon";
import { Session } from "next-auth";
import Logout from "./Logout";

interface SessionProp {
  session: Session | null;
}

export default function Navbar({ session }: SessionProp) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const checkScreenSize = () => {
    if (typeof window !== "undefined") {
      setIsOpen(window.innerWidth >= 992);
    }
  };

  useEffect(() => {
    setIsOpen(window.innerWidth >= 992);
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (useHiddenNavbar()) {
    return null;
  }

  const ComponentPlus = () => {
    if (session?.user?.role === "Superadmin") {
      return (
        <li>
          <Link
            href="/superadmin"
            className="block rounded-lg bg-[#18563F] px-4 py-2 text-white  md:bg-transparent md:p-0 md:hover:bg-transparent hover:text-[#A3CD39] transition-colors duration-500"
          >
            Admin
          </Link>
        </li>
      );
    }

    if (session?.user?.role === "Admin") {
      return (
        <li>
          <Link
            href="/admin"
            className="block rounded-lg bg-[#18563F] px-4 py-2 text-white  md:bg-transparent md:p-0 md:hover:bg-transparent hover:text-[#A3CD39] transition-colors duration-500"
          >
            Admin
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
            className="block rounded-lg bg-[#18563F] px-4 py-2 text-white  md:bg-transparent md:p-0 md:hover:bg-transparent hover:text-[#A3CD39] transition-colors duration-500"
          >
            Akademik
          </Link>
        </li>
      );
    }

    return null;
  };

  return (
    <nav className="sticky top-0 z-50 border-gray-300 bg-[#18563F] text-white md:shadow-lg">
      <div className="w-full bg-[#0d4430] p-3">
        <div className="container mx-auto flex justify-between px-4 py-2  overflow-hidden">
          <div className="left">
            <ul className="flex gap-10 items-center">
              {[
                { name: "IoLogoWhatsapp", text: "0812 9633 4496" },
                { name: "FaPhoneAlt", text: "0812 9633 4496" },
                { name: "MdEmail", text: "pmb@stmikku.ac.id" },
              ]
                .map((item) => ({
                  ...item,
                  name: item.name as
                    | "IoLogoWhatsapp"
                    | "FaPhoneAlt"
                    | "MdEmail",
                }))
                .map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() =>
                        setActiveIcon(
                          activeIcon === item.name ? null : item.name
                        )
                      }
                      className="flex items-center space-x-3 hover:text-[#A3CD39] transition-colors duration-500"
                    >
                      <Icon name={item.name} className="text-lg" />

                      <p
                        className={`font-semibold ${
                          activeIcon === item.name
                            ? "inline opacity-100"
                            : "hidden"
                        } md:inline`}
                      >
                        {item.text}
                      </p>
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div className="right lg:justify-between lg:items-center space-x-8 lg:flex hidden sm:block">
            <div className="left">
              <ul className="flex items-center space-x-5">
                {[
                  "FaFacebookF",
                  "FaInstagram",
                  "IoLogoGoogleplus",
                  "FaYoutube",
                ].map((icon) => (
                  <li key={icon}>
                    <Link href="/" className="hover:text-[#A3CD39]">
                      <Icon
                        name={
                          icon as
                            | "FaFacebookF"
                            | "FaInstagram"
                            | "IoLogoGoogleplus"
                            | "FaYoutube"
                        }
                        className="text-xl shrink-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <span className="hidden lg:block">|</span>
            <div className="right hidden lg:block">
              <ul className="flex items-center space-x-4">
                {["Indonesia", "English"].map((lang) => (
                  <li key={lang}>
                    <Link href="/" className="hover:text-[#A3CD39]">
                      <p className="font-semibold">{lang}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="container mx-auto flex items-center justify-between py-4 md:p-4 gap-5">
          <Link href="/" className="flex items-center space-x-3 ">
            <Image
              src="/image/Logo.png"
              alt="LMSN Logo"
              className="hidden md:block w-16"
              width={40}
              height={40}
            />
            <p className="self-center md:text-xl font-bold text-white uppercase w-72 md:w-96 break-words">
              School Of Technopreneur Nusantara
            </p>
          </Link>

          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 mr-5 md:mr-0 text-white hover:bg-[#0d4430] focus:outline-none focus:ring-2 focus:ring-white"
            aria-controls="navbar-default"
            aria-expanded={isOpen ? true : false}
            onClick={toggleNavbar}
          >
            <span className="sr-only">Open main menu</span>
            <div className="space-y-1.5">
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-500 ease-in-out ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-500 ease-in-out ${
                  isOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-500 ease-in-out ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>

          <div
            id="navbar-default"
            className={`absolute left-0 top-full z-50 w-full transform bg-[#18563F] transition-all duration-500 ease-in-out lg:relative lg:z-auto lg:flex lg:w-auto lg:items-center lg:bg-transparent  ${
              isOpen
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <ul className="flex flex-col flex-wrap gap-3 justify-center items-center border-t-2 border-white  p-4 font-medium lg:mt-0 lg:flex-row lg:items-center lg:space-x-8 lg:border-0 lg:p-0 lg:text-lg">
              {[
                "Home",
                "About Us",
                "Admision",
                "Programme",
                "Campus Activities",
                "Contac Us",
              ].map((menu) => (
                <li key={menu}>
                  <Link
                    href="/"
                    className="block rounded-lg bg-[#18563F] px-4 py-2 text-white  md:bg-transparent md:p-0 md:hover:bg-transparent hover:text-[#A3CD39] transition-colors duration-500"
                  >
                    {menu}
                  </Link>
                </li>
              ))}
              {session ? (
                <>
                  <ComponentPlus />
                  <li>
                    <div className="flex w-full justify-center text-white rounded hover:text-[#A3CD39] transition-colors duration-500">
                      <Logout className="block rounded-lg bg-[#18563F] px-4 py-2 text-white  md:bg-transparent md:p-0 md:hover:bg-transparent hover:text-[#A3CD39] transition-colors duration-500 " />
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/auth/login"
                    className="block text-white rounded hover:text-[#A3CD39] transition-colors duration-500"
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
