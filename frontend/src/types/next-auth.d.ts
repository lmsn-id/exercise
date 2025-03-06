import "next-auth";

declare module "next-auth" {
  interface Session {
    refreshToken?: string;
    accessToken: string;
    user: {
      id: string;
      token?: string;
      is_superadmin?: string;
      expired?: string;

      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    token: string;
    is_superadmin: string;
    expired: string;
    role: string;
    navigate: string;
    message: string;
  }
}
