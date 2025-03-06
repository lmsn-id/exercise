import { useEffect } from "react";
import { useSession } from "~/context/SessionProvider";
import dayjs from "dayjs";

const useAutoRefreshToken = () => {
  const { session, updateSession } = useSession();

  useEffect(() => {
    if (!session?.user?.expired) return;

    const currentTime = dayjs();
    const expiredTime = dayjs(session.user.expired);
    const timeUntilExpired = expiredTime.diff(currentTime, "millisecond");

    const refreshToken = async () => {
      try {
        const now = dayjs();
        const localDate = now.format("DD/MM/YYYY");
        const localTime = now.format("HH:mm");
        const time = `${localDate} ${localTime}`;

        const res = await fetch("/api/auth/refresh-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: session.user.token,
            time,
          }),
        });

        if (!res.ok) throw new Error("Gagal memperbarui token");

        const data = await res.json();

        // Update session dengan token baru
        updateSession({
          ...session,
          user: {
            ...session.user,
            token: data.token,
            expired: data.expired,
          },
        });

        console.log("Token berhasil diperbarui:", data);
      } catch (error) {
        console.error("Gagal memperbarui token:", error);
      }
    };

    // Jika token akan kedaluwarsa dalam 1 menit, refresh token
    if (timeUntilExpired <= 60000) {
      refreshToken();
    }

    // Set timeout untuk memeriksa ulang sebelum token kedaluwarsa
    const timeout = setTimeout(() => {
      refreshToken();
    }, timeUntilExpired - 60000); // 1 menit sebelum kedaluwarsa

    return () => clearTimeout(timeout);
  }, [session, updateSession]);

  return null;
};

export default useAutoRefreshToken;
