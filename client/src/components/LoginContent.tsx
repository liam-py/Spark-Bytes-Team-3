"use client";

import React from "react";
import { Typography, Form, Input, Button, message } from "antd";

/**
 * LoginContent
 * - CHANGE: Remove local useState and let AntD Form manage field values/validation.
 * - CHANGE: Add "name" to Form.Item so AntD can collect values.
 * - CHANGE: Use Input.Password for masking.
 * - CHANGE: Wire up /api/auth/login with fetch in onFinish.
 * - CHANGE: Add basic success/error toasts.
 */
export default function LoginContent() {
  const [form] = Form.useForm();

  // CHANGE: onFinish now receives validated values from AntD Form
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), // { email, password }
      });
      const data = await res.json();
      if (!res.ok) {
        // CHANGE: show backend error or generic message
        return message.error(data?.error || "Login failed");
      }
      message.success(`Welcome back: ${data.user?.email || values.email}`);
      // Optional redirect after login:
      // window.location.href = "/";
    } catch (e) {
      message.error("Network error");
    }
  };

  return (
    <div>
      <Typography.Text>Enter existing email and password</Typography.Text>

      {/* CHANGE: add layout + bind form + onFinish */}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* CHANGE: add "name" so AntD can track and validate the field */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
        >
          {/* CHANGE: controlled by Form, no local useState */}
          <Input placeholder="email" />
        </Form.Item>

        {/* CHANGE: use Input.Password and add min length validation */}
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 6, message: "Please enter a password (≥ 6 chars)" }]}
        >
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
