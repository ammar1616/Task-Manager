import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, Descriptions, Tag, message, Popconfirm } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';
import api, { SERVER_URL } from '../api/axios';
import { Task } from '../types';
import type { UploadFile } from 'antd';

interface Props {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const priorityColors: Record<string, string> = {
  high: '#ff4d4f',
  medium: '#faad14',
  low: '#52c41a',
};

const TaskDetail: React.FC<Props> = ({ task, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (open && task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      });
      setEditing(false);
      setFileList([]);
    }
  }, [open, task, form]);

  const handleUpdate = async (values: Record<string, unknown>) => {
    if (!task) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title as string);
      if (values.description) formData.append('description', values.description as string);
      formData.append('status', values.status as string);
      formData.append('priority', values.priority as string);
      if (values.dueDate) formData.append('dueDate', (values.dueDate as dayjs.Dayjs).toISOString());
      if (fileList.length > 0) {
        formData.append('attachment', fileList[0].originFileObj as Blob);
      }
      await api.put(`/tasks/${task._id}`, formData);
      message.success('Task updated');
      setEditing(false);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof AxiosError ? err.response?.data?.message : null;
      message.error(msg || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      message.success('Task deleted');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof AxiosError ? err.response?.data?.message : null;
      message.error(msg || 'Delete failed');
    }
  };

  return (
    <Modal
      title={task?.title}
      open={open}
      onCancel={() => { setEditing(false); onClose(); }}
      footer={
        editing
          ? [
              <Button key="cancel" onClick={() => setEditing(false)}>Cancel</Button>,
              <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>Save</Button>,
            ]
          : task
          ? [
              <Button key="edit" type="primary" onClick={() => setEditing(true)}>Edit</Button>,
              <Popconfirm key="delete" title="Delete this task?" onConfirm={handleDelete}>
                <Button danger>Delete</Button>
              </Popconfirm>,
            ]
          : []
      }
    >
      {task && !editing ? (
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Description">{task.description || '-'}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag>{task.status.replace('_', ' ')}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Due Date">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
          </Descriptions.Item>
          {task.attachment && (
            <Descriptions.Item label="Attachment">
              <a href={`${SERVER_URL}${task.attachment}`} target="_blank" rel="noreferrer">View file</a>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Created">
            {new Date(task.createdAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
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
      )}
    </Modal>
  );
};

export default TaskDetail;
