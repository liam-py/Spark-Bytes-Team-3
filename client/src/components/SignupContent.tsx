"use client";

import React from "react";
import { Typography, Form, Input, Button, message } from "antd";

/**
 * SignupContent
 * - CHANGE: Remove local useState; rely on AntD Form state.
 * - CHANGE: Add "name" to Form.Item (email/password/name) for value collection.
 * - CHANGE: Use Input.Password for secure password input.
 * - CHANGE: Call /api/users (signup) in onFinish and show success toast.
 * - CHANGE: Reset form after successful signup.
 */
export default function SignupContent() {
  const [form] = Form.useForm();

  // CHANGE: onFinish collects validated values from the form
  const onFinish = async (values: { email: string; password: string; name?: string }) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), // { email, password, name? }
      });
      const data = await res.json();
      if (!res.ok) {
        // Backend may return { error: "Email already registered" } or similar
        return message.error(data?.error || "Sign up failed");
      }
      message.success("Account created. Please log in.");
      form.resetFields(); // CHANGE: clear inputs after success
    } catch (e) {
      message.error("Network error");
    }
  };

  return (
    <div>
      <Typography.Text>Create a new account</Typography.Text>

      {/* CHANGE: add layout + bind form + onFinish */}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Optional display name (you can remove this block if not needed) */}
        <Form.Item name="name" label="Name">
          <Input placeholder="your name (optional)" />
        </Form.Item>

        {/* CHANGE: add "name" with email validation */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
        >
          <Input placeholder="email" />
        </Form.Item>

        {/* CHANGE: use Input.Password and min length rule */}
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 6, message: "Please enter a password (≥ 6 chars)" }]}
        >
          <Input.Password placeholder="password (≥ 6 chars)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
