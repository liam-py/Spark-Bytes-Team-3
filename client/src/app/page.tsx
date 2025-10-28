"use client";

import { Typography, Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Typography.Title level={1}>Spark! Bytes</Typography.Title>
      <Typography.Title level={2}>Free food is one click away!</Typography.Title>
      <Link href="/authentication">
        <Button type="primary">Continue</Button>
      </Link>
    </main>
  );
}
