import Login from "~/components/Login";
import { SessionData } from "@/auth";

export default async function LoginServer() {
  const session = await SessionData();

  return <Login session={session} />;
}
