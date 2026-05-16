import { redirect } from "next/navigation";

export default function StorePage() {
  // Redirect users back to the homepage since that's where the shop now lives
  redirect("/");
}