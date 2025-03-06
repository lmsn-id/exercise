import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

type Logout = {
  className?: string;
};

export default function Logout({ className }: Logout) {
  const handleLogout = () => {
    toast.success("Logging out...", {
      onClose: () => {
        signOut({ callbackUrl: "/" });
      },
    });
  };

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
}
