import { GoogleLogin } from "@react-oauth/google";
import { Typography } from "antd";
import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { middleware } from "./home";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await middleware(request);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { supabase, headers } = await middleware(request);
  const { token } = await request.json();

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token,
  });

  if (error) {
    throw new Error(`Failed to login: ${error.message}`);
  }

  return new Response(JSON.stringify({ data }), {
    headers,
  });
}

export default function Login() {
  useLoaderData();
  const fetcher = useFetcher();

  return (
    <div className="p-4 flex flex-col items-center h-screen justify-center space-y-4">
      <Typography.Title level={2}>Login</Typography.Title>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            console.error("No credential found");
            return;
          }

          fetcher.submit(
            { token: credentialResponse.credential },
            { method: "post", encType: "application/json" }
          );
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}
