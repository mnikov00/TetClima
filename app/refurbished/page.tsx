import { redirect } from "next/navigation";

export default function RefurbishedPage() {
  redirect("/products?refurbished=1");
}

