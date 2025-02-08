import {
  DeleteOutlined,
  EditOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { Button, List, Typography } from "antd";
import { useState } from "react";
import type { Code, CodeUpdate } from "~/models";
import CodeModal from "./CodeModal";
import { useFetcher, useNavigate } from "react-router";
import { Actions } from "~/routes/home";

type Props = {
  item: Code;
};

export default function CodeItem({ item }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  function updateCode(code: CodeUpdate) {
    fetcher.submit(
      { action: Actions.UPDATE_CODE, code },
      { method: "post", encType: "application/json" }
    );
  }

  function deleteCode(id: number) {
    fetcher.submit(
      { action: Actions.DELETE_CODE, id },
      { method: "post", encType: "application/json" }
    );
  }

  return (
    <>
      <List.Item>
        <List.Item.Meta
          title={<Typography.Text>https://{item.url}</Typography.Text>}
          description={`${item.views} / ${item.goal} Views`}
        />
        <div className="space-x-2">
          <Button
            onClick={() => setModalOpen(true)}
            icon={<EditOutlined />}
          ></Button>
          <Button
            icon={<QrcodeOutlined />}
            onClick={() => navigate(`/detail/${item.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteCode(item.id)}
          />
        </div>
      </List.Item>
      <CodeModal
        item={item}
        open={modalOpen}
        onOk={updateCode}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
