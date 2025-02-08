import type { Route } from "./+types/home";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Progress, QRCode } from "antd";
import type { Code } from "~/models";
import { useEffect, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";
import { middleware } from "~/utils/middleware";
import { useReward } from "react-rewards";

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
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const url = `${baseUrl}/redirect/${initialData.data.id}`;
  const { reward } = useReward("goalConfetti", "confetti", {
    spread: 100,
    elementCount: 150,
  });

  const realtimeCount = useEventSource(`/realtime/${initialData.data.id}`, {
    event: "countUpdate",
  });
  const count = realtimeCount ? Number(realtimeCount) : code.views;

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (count === code.goal) {
      reward();
    }
  }, [count, code.goal]);

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-4">
      <QRCode value={url} size={250} />
      <span id="goalConfetti" />
      {url}
      <Progress
        className="w-1/2"
        percent={(count / code.goal) * 100}
        format={() => `${count} / ${code.goal}`}
      />
    </div>
  );
}
