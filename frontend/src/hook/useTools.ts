import { usePathname } from "next/navigation";
import { useRef } from "react";
import { create } from "zustand";
import { useState, useEffect } from "react";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useHiddenNavbar = () => {
  const pathname = usePathname() || "";

  return (
    pathname.startsWith("/superadmin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin")
  );
};

export const InputTypeNumber = () => {
  const inputnumber = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return {
    inputnumber,
    handleInput,
  };
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
}));

export const NavbarUseEffect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return {
    toggleMenu,
    isMobile,
    isOpen,
    setIsOpen,
  };
};

export const SidebarAdminUseEffect = () => {
  const [openAccount, setopenAccount] = useState(false);
  const [openChatbot, setopenChatbot] = useState(false);

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setopenAccount(false);
        setopenChatbot(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return {
    openAccount,
    setopenAccount,
    openChatbot,
    setopenChatbot,
    dropdownRef,
  };
};
