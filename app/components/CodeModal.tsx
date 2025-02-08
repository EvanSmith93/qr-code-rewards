import { Form, Input, InputNumber, Modal } from "antd";
import type { Code, CodeUpdate } from "~/models";
import { validateUrl } from "~/utils/helpers";

type Props = {
  item?: Code;
  open: boolean;
  onOk: (code: CodeUpdate) => void;
  onClose: () => void;
};

export default function CodeModal({ item, open, onOk, onClose }: Props) {
  const [form] = Form.useForm();

  const onFinish = (values: CodeUpdate) => {
    console.log({ id: item?.id, ...values });
    onOk({ id: item?.id, ...values });
    onClose();
  };

  const title = item ? "Edit Code" : "Create Code";
  const initialValues = item || { url: "", goal: 1 };

  return (
    <Modal open={open} title={title} onCancel={onClose} onOk={form.submit}>
      <Form form={form} onFinish={onFinish} initialValues={initialValues}>
        <Form.Item
          label="URL"
          name="url"
          rules={[{ required: true, validator: validateUrl }]}
          validateTrigger="submit"
        >
          <Input addonBefore="https://" />
        </Form.Item>
        <Form.Item label="Goal" name="goal" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
