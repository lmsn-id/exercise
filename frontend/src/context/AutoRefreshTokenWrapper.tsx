// components/AutoRefreshTokenWrapper.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "./SessionProvider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function AutoRefreshTokenWrapper() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.token) return;

    const currentTime = Date.now();
    const tokenExpirationTime = new Date(
      session.user.expired as string
    ).getTime();

    const timeRemaining = tokenExpirationTime - currentTime;

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
          } else {
            console.log("Token berhasil diperbarui");

            router.refresh();
          }
        } catch (error) {
          console.error("Gagal memperbarui token:", error);
        }
      };

      refreshToken();
    } else {
      const timeoutId = setTimeout(() => {
        router.refresh();
      }, timeRemaining - 60000);

      return () => clearTimeout(timeoutId);
    }
  }, [session, router]);

  return null;
}
