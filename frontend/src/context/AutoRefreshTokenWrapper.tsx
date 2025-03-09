"use client";

import { useEffect, useState } from "react";
import { useSession } from "./SessionProvider";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useIdleTimer } from "react-idle-timer";

export default function AutoRefreshTokenWrapper() {
  const { session } = useSession();
  const router = useRouter();
  const [isIdle, setIsIdle] = useState(false);

  const handleOnIdle = () => {
    setIsIdle(true);
    console.log("User is idle");
  };

  const handleOnActive = () => {
    setIsIdle(false);
    console.log("User is active");
  };

  useIdleTimer({
    timeout: 1 * 60 * 1000,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });

  useEffect(() => {
    if (!session?.user?.token || isIdle) return;

    const currentTime = dayjs();
    const tokenExpirationTime = dayjs(session.user.expired);

    if (tokenExpirationTime.isBefore(currentTime)) {
      console.warn("Token expired, logging out...");
      signOut({ callbackUrl: "/auth/login" });
      return;
    }

    const timeRemaining = tokenExpirationTime.diff(currentTime, "milliseconds");

    if (timeRemaining <= 60000) {
      const refreshToken = async () => {
        try {
          const now = dayjs();
          const localDate = now.format("DD/MM/YYYY");
          const localTime = now.format("HH:mm");
          const time = `${localDate} ${localTime}`;

          const result = await signIn("credentials", {
            redirect: false,
            username: session.user.id,
            password: session.user.token,
            time,
            isRefresh: true,
          });

          if (result?.error) {
            console.error("Gagal memperbarui token:", result.error);
            signOut({ callbackUrl: "/auth/login" });
          } else {
            console.log("Token berhasil diperbarui");
            router.refresh();
          }
        } catch (error) {
          console.error("Gagal memperbarui token:", error);
          signOut({ callbackUrl: "/auth/login" });
        }
      };

      refreshToken();
    } else {
      const timeoutId = setTimeout(() => {
        router.refresh();
      }, timeRemaining - 60000);

      return () => clearTimeout(timeoutId);
    }
  }, [session, router, isIdle]);

  return null;
}
