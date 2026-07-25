import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api/axios';
import type { UploadFile } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TaskForm: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: any = {
        title: values.title,
        description: values.description,
        priority: values.priority || 'medium',
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      };

      const res = await api.post('/tasks', payload);

      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append('attachment', fileList[0].originFileObj as Blob);
        await api.put(`/tasks/${res.data._id}`, formData);
      }

      message.success('Task created');
      form.resetFields();
      setFileList([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="New Task"
      open={open}
      onCancel={() => { form.resetFields(); setFileList([]); onClose(); }}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title required' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="priority" label="Priority">
          <Select>
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Attachment">
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
