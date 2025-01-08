import type { Route } from "./+types/home";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Code } from "~/models";
import { useEffect } from "react";
import { middleware } from "~/utils/middleware";

export function meta({}: Route.MetaArgs) {
  return [{ title: "QR Code Rewards" }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { supabase } = await middleware(request, false);

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

  useEffect(() => {
    window.location.href = initialData.data.url;
  }, []);
}
