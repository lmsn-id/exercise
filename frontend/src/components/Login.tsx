"use client";
import { useLogin } from "~/hook/auth/useAkun";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { useState } from "react";
import Icon from "./Icon";

interface LoginPageProps {
  session: Session | null;
}

export default function Login({ session }: LoginPageProps) {
  const [ShowPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, onSubmit } = useLogin(session);

  return (
    <>
      <div className="min-h-screen w-full flex justify-center md:grid md:grid-cols-2">
        <section className="relative hidden md:flex justify-center items-center w-full h-full">
          <Image
            src="/image/bk.png"
            width={600}
            height={600}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <Image
            src="/image/img.svg"
            alt="Icon"
            width={300}
            height={300}
            className="max-w-[50%] w-full relative z-10"
          />
        </section>

        <section className="flex justify-center items-center">
          <div className="max-w-[450px] p-6 flex flex-col items-center">
            <p className="uppercase text-5xl font-bold text-center">
              <span className="text-[#843bc7]">Login Page</span>
            </p>
            <div className="w-36 h-1 bg-[#843bc7] my-6"></div>

            <form
              className="w-full flex flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative w-full mb-6">
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className="w-full bg-gray-300 text-gray-800 text-[1.1em] tracking-wide py-3.5 px-16 rounded-full outline-none border-none"
                />
                <Icon
                  name="FaUser"
                  className="fas fa-user absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-500 transition-colors duration-400"
                />
              </div>

              <div className="relative w-full mb-6">
                <input
                  type={ShowPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full bg-gray-300 text-gray-800 text-[1.1em] tracking-wide py-3.5 px-16 rounded-full outline-none border-none"
                />
                <Icon
                  name="FaLock"
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-500 transition-colors duration-400"
                />
                <Icon
                  onClick={() => setShowPassword(!ShowPassword)}
                  name={ShowPassword ? "FaEye" : "FaEyeSlash"}
                  className="absolute cursor-pointer right-8 top-1/2 transform -translate-y-1/2 text-gray-500 transition-colors duration-400 hover:text-gray-800"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      {...register("remember")}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full mb-4 text-white py-3.5 px-16 rounded-full uppercase tracking-wider font-bold bg-gradient-to-r from-purple-700 to-blue-500 cursor-pointer transition-opacity duration-400 hover:opacity-90 mt-8"
              >
                Login
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
