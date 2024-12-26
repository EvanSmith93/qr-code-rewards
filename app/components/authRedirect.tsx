import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { supabase } from "~/supabaseClient";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <Spin />;
  }

  if (location.pathname !== "/login") {
    if (!session) {
      return <Navigate to="/login" replace />;
    }
  } else {
    if (session) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
