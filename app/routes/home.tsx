import { supabase } from "~/supabaseClient";
import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { Button, List, Typography } from "antd";
import { useState } from "react";
import type { Code } from "~/models";
import { DeleteOutlined, QrcodeOutlined } from "@ant-design/icons";

export function meta({}: Route.MetaArgs) {
  return [{ title: "QR Code Rewards" }];
}

export async function clientLoader() {
  const { data, error } = await supabase
    .from("code")
    .select("*")
    .order("created_at");

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data from Supabase.");
  }

  return { data };
}

export default function Home() {
  const initialData = useLoaderData() as { data: Code[] };
  const [codes, setCodes] = useState<Code[]>(initialData.data);

  async function createCode() {
    const { data, error } = await supabase
      .from("code")
      .insert([{ url: "" }])
      .select();

    if (error) {
      console.error("Error creating code:", error);
    } else {
      setCodes((prevData) => [...prevData, ...data]);
    }
  }

  async function updateUrl(id: number, url: string) {
    const { error } = await supabase.from("code").update({ url }).match({ id });

    if (error) {
      console.error("Error updating code:", error);
    } else {
      setCodes((prevData) =>
        prevData.map((item) => (item.id === id ? { ...item, url } : item))
      );
    }
  }

  async function deleteCode(id: number) {
    const { error } = await supabase.from("code").delete().match({ id });

    if (error) {
      console.error("Error deleting code:", error);
    } else {
      setCodes((prevData) => prevData.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="p-4">
      <List
        dataSource={codes}
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
