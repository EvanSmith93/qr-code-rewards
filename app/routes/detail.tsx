import type { Route } from "./+types/home";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Progress, QRCode } from "antd";
import type { Code } from "~/models";
import { useState } from "react";
import { useLocation } from "react-router";
import { useEventSource } from "remix-utils/sse/react";
import { middleware } from "~/utils/middleware";

export function meta({}: Route.MetaArgs) {
  return [{ title: "QR Code Rewards" }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { supabase } = await middleware(request);
  const user = (await supabase.auth.getUser()).data.user!;

  const { data, error } = await supabase
    .from("code")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data from Supabase.");
  }

  return { data: data[0] };
}

export default function Detail() {
  const initialData = useLoaderData() as { data: Code };
  const [code, setCode] = useState<Code>(initialData.data);
  const location = useLocation();
  const baseUrl = "http://localhost:5173";
  const url = `${baseUrl}/redirect/${initialData.data.id}`;

  const realtimeCount = useEventSource(`/realtime/${initialData.data.id}`, {
    event: "countUpdate",
  });
  const count = realtimeCount ? Number(realtimeCount) : code.views;

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
      <QRCode value={url} />
      {url}
      <Progress
        className="w-1/2"
        percent={(count / code.goal) * 100}
        format={() => `${count} / ${code.goal}`}
      />
    </div>
  );
}
