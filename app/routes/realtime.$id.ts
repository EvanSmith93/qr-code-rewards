import type { LoaderFunctionArgs } from "react-router";
import { eventStream } from "remix-utils/sse/server";
import { middleware } from "~/routes/home";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { supabase } = await middleware(request);

  return eventStream(request.signal, (send: (data: any) => void) => {
    const channel = supabase
      .channel(`code_${params.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "code",
          filter: `id=eq.${params.id}`,
        },
        (payload: any) => {
          send({ event: "countUpdate", data: JSON.stringify(payload.new.views) });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  });
}
