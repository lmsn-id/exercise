import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { Session } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        time: { label: "Time", type: "text" },
        isRefresh: { label: "IsRefresh", type: "boolean" },
      },
      async authorize(credentials) {
        try {
          let res;
          if (credentials?.isRefresh) {
            res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
              {
                id: credentials.username,
                token: credentials.password,
                time: credentials.time,
              },
              {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            );
          } else {
            res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
              {
                username: credentials?.username,
                password: credentials?.password,
                time: credentials?.time,
              },
              {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                  "Content-Type": "application/json",
                },
              }
            );
          }

          const { id, token, role, expired, navigate, message } = res.data;

          console.log("Response Rust:", res.data);

          return {
            id,
            token,
            role,
            expired,
            navigate,
            message,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Login failed");
          }
          throw new Error("An error occurred. Please try again.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.role = user.role;
        token.expired = user.expired;
        token.navigate = user.navigate;
        token.message = user.message;
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.token) {
        return {} as Session;
      }

      session.user = {
        id: token.id,
        token: token.token,
        is_superadmin: token.is_superadmin,
        role: token.role,
        expired: token.expired ?? null,
      };

      session.user.navigate = token.navigate;
      session.user.message = token.message;

      return session;
    },
  },

  events: {
    async signOut({ token }) {
      if (!token?.token) return;
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
          {
            data: { access_token: token.token },
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
              Token: `${token.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Access token berhasil dihapus.");
      } catch (error) {
        console.error("Gagal menghapus access token:", error);
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
