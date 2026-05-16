import { redirect } from "next/navigation";

export default function Home() {
  redirect(`/${process.env.MELLOWGRID_DEFAULT_USER ?? "username"}`);
}
