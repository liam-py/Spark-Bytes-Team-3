"use client";

import { Typography, Button, Divider } from "antd";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
    const { data: session, status } = useSession();

    // if there's no active session, the user isn't signed in. Redirect them
    if (!session) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <Typography.Title level={3}>You’re not signed in</Typography.Title>
                <Link href="/authentication"><Button type="primary">Sign in now</Button></Link>
            </div>
        );
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <Typography.Title level={1}>Hi, {session.user?.name}</Typography.Title>
            <Typography.Title level={2}>Welcome to Spark! Bytes!</Typography.Title>
            <Divider/>
            <Button
            type="default"
            onClick={() => signOut({ callbackUrl: "/authentication" })}
            className="mt-6"
            >
                Sign Out
            </Button>
        </main>
    );
}
