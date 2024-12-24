import { GoogleLogin } from "@react-oauth/google";
import { Typography } from "antd";
import { supabase } from "~/supabaseClient";

export default function Login() {
  return (
    <div className="p-4 flex flex-col items-center h-screen justify-center space-y-4">
      <Typography.Title level={2}>Login</Typography.Title>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            console.error("No credential found");
            return;
          }

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: credentialResponse.credential,
          });

          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Logged in:", data);
          }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}
