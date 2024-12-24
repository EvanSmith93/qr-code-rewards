import { supabase } from "~/supabaseClient";
import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import type { Code } from "~/models";

export function meta({}: Route.MetaArgs) {
  return [{ title: "QR Code Rewards" }];
}

export async function clientLoader({ params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("code")
    .select("*")
    .eq("id", params.id);

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data from Supabase.");
  }

  await supabase
    .from("code")
    .update({ views: data[0].views + 1 })
    .match({ id: data[0].id });

  return { data: data[0] };
}

export default function Detail() {
  const initialData = useLoaderData() as { data: Code };
  window.location.href = initialData.data.url;
}
