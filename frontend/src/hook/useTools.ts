import { usePathname } from "next/navigation";
import { useRef } from "react";
import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useHiddenNavbar = () => {
  const pathname = usePathname() || "";

  return pathname.startsWith("/superadmin") || pathname.startsWith("/auth");
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
