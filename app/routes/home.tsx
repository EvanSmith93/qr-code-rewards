import type { Route } from "./+types/home";
import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { Button, List, Typography } from "antd";
import type { Code, CodeUpdate } from "~/models";
import { middleware } from "~/utils/middleware";
import CodeItem from "~/components/CodeItem";
import CodeModal from "~/components/CodeModal";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "QR Code Rewards" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  // const { supabase, headers } = await middleware(request);
  // const user = (await supabase.auth.getUser()).data.user!;

  // const { data, error } = await supabase
  //   .from("code")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .order("created_at");
  const data = [
    { id: 1, title: "Test", url: "hello.world", goal: 100, views: 0 },
  ];

  // const error = null;
  // if (error) {
  //   console.error("Error fetching data:", error);
  //   throw new Error("Failed to fetch data from Supabase.");
  // }

  return new Response(JSON.stringify({ data }), {});
}

export enum Actions {
  CREATE_CODE = "CREATE_CODE",
  UPDATE_CODE = "UPDATE_CODE",
  DELETE_CODE = "DELETE_CODE",
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { supabase, headers } = await middleware(request);
  const reqData = await request.json();

  switch (reqData.action) {
    case Actions.CREATE_CODE: {
      const { data, error } = await supabase
        .from("code")
        .insert([reqData.code])
        .select();

      if (error) {
        throw new Error(`Failed to create code.`);
      }

      return new Response(JSON.stringify({ data }), {
        headers,
      });
    }

    case Actions.UPDATE_CODE: {
      const { error } = await supabase
        .from("code")
        .update(reqData.code)
        .match({ id: reqData.code.id });

      if (error) {
        throw new Error(`Failed to update code.`);
      }

      return {};
    }

    case Actions.DELETE_CODE: {
      const { id } = reqData;
      const { error } = await supabase.from("code").delete().match({ id });

      if (error) {
        throw new Error(`Failed to delete code.`);
      }

      return {};
    }
  }
}

export default function Home() {
  const { data } = JSON.parse(useLoaderData()) as { data: Code[] };
  const fetcher = useFetcher();
  const [modalOpen, setModalOpen] = useState(false);

  function createCode(code: CodeUpdate) {
    fetcher.submit(
      { action: Actions.CREATE_CODE, code },
      { method: "post", encType: "application/json" }
    );
  }

  return (
    <div className="p-4 w-1/3 mx-auto">
      <Typography.Title level={2}>Your Codes</Typography.Title>
      <List dataSource={data} renderItem={(item) => <CodeItem item={item} />} />
      <Button type="dashed" onClick={() => setModalOpen(true)}>
        Create New Code
      </Button>
      <CodeModal
        open={modalOpen}
        onOk={createCode}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
