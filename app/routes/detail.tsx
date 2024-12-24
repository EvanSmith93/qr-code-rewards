import { supabase } from "~/supabaseClient";
import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { Progress, QRCode } from "antd";
import type { Code } from "~/models";
import { useEffect, useState } from "react";

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

  return { data: data[0] };
}

export default function Detail() {
  const initialData = useLoaderData() as { data: Code };
  const [code, setCode] = useState<Code>(initialData.data);
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/redirect/${initialData.data.id}`;

  useEffect(() => {
    const channel = supabase
      .channel(`code_${initialData.data.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "code",
          filter: `id=eq.${initialData.data.id}`,
        },
        (payload) => setCode(payload.new as Code)
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
      <QRCode value={url} />
      {url}
      <Progress
        className="w-1/2"
        percent={(code.views / code.goal) * 100}
        format={() => `${code.views} / ${code.goal}`}
      />
    </div>
  );
}
