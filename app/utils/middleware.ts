import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { redirect } from "react-router";

export async function middleware(
  request: Request,
  autoRedirect: boolean = true
) {
  const headers = new Headers();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getSession();
  const path = new URL(request.url).pathname;

  if (autoRedirect) {
    if (path === "/login" && data.session) {
      throw redirect("/");
    } else if (path !== "/login" && !data.session) {
      throw redirect("/login");
    }
  }

  return { supabase, headers };
}
