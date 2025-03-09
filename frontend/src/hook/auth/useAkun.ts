import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";

interface FormData {
  username: string;
  password: string;
  email: string;
  remember: boolean;
}

export const useLogin = (session: Session | null) => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const { message, navigate } = session.user;

      if (message === "Login Berhasil") {
        router.push(navigate);
      } else {
        toast.error(message);
      }
    }
  }, [session, router]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!data.username || !data.password || !data.remember) {
        toast.info(
          ` ${!data.username ? "Username Tidak Boleh Kosong" : ""} ${
            !data.password ? "Password Tidak Boleh Kosong" : ""
          } ${!data.remember ? "Tolong Centang Remember" : ""} `
        );
        return;
      }

      const now = dayjs();
      const localDate = now.format("DD/MM/YYYY");
      const localTime = now.format("HH:mm");

      const time = `${localDate} ${localTime}`;
      console.log(time);

      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
        time,
      });

      if (res?.ok) {
        router.refresh();
      } else {
        toast.error(res?.error || "Login gagal");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login Gagal");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
  };
};

export const useRegister = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message, {
          onClose: () => {
            router.push(response.data.navigate);
          },
        });
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        const errorMessage = (err.response.data as { message: string }).message;
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
  };
};
