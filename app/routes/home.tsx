import type { Route } from "./+types/home";
import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { Button, List, Typography } from "antd";
import type { Code } from "~/models";
import { DeleteOutlined, QrcodeOutlined } from "@ant-design/icons";
import { middleware } from "~/utils/middleware";

export function meta({}: Route.MetaArgs) {
  return [{ title: "QR Code Rewards" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = await middleware(request);
  const user = (await supabase.auth.getUser()).data.user!;

  const { data, error } = await supabase
    .from("code")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at");

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data from Supabase.");
  }

  return new Response(JSON.stringify({ data }), {
    headers,
  });
}

enum Actions {
  CREATE_CODE = "CREATE_CODE",
  UPDATE_URL = "UPDATE_URL",
  DELETE_CODE = "DELETE_CODE",
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { supabase, headers } = await middleware(request);
  const data = await request.json();

  switch (data.action) {
    case Actions.CREATE_CODE: {
      const { data, error } = await supabase
        .from("code")
        .insert([{ url: "" }])
        .select();

      if (error) {
        throw new Error(`Failed to create code.`);
      }

      return new Response(JSON.stringify({ data }), {
        headers,
      });
    }

    case Actions.UPDATE_URL: {
      const { id, url } = data;
      const { error } = await supabase
        .from("code")
        .update({ url })
        .match({ id });

      if (error) {
        throw new Error(`Failed to update code.`);
      }

      return {};
    }

    case Actions.DELETE_CODE: {
      const { id } = data;
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

  async function createCode() {
    fetcher.submit(
      { action: Actions.CREATE_CODE },
      { method: "post", encType: "application/json" }
    );
  }

  async function updateUrl(id: number, url: string) {
    fetcher.submit(
      { action: Actions.UPDATE_URL, id, url },
      { method: "post", encType: "application/json" }
    );
  }

  async function deleteCode(id: number) {
    fetcher.submit(
      { action: Actions.DELETE_CODE, id },
      { method: "post", encType: "application/json" }
    );
  }

  return (
    <div className="p-4 w-1/3 mx-auto">
      <Typography.Title level={2}>Your Codes</Typography.Title>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Typography.Text
                  editable={{ onChange: (value) => updateUrl(item.id, value) }}
                >
                  {item.url}
                </Typography.Text>
              }
              description={`${item.views} Views`}
            />
            <div className="space-x-2">
              <Button icon={<QrcodeOutlined />} href={`/detail/${item.id}`} />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => deleteCode(item.id)}
              />
            </div>
          </List.Item>
        )}
      />
      <Button type="dashed" onClick={createCode}>
        Create New Code
      </Button>
    </div>
  );
}
