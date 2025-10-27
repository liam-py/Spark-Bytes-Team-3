"use client"; // marks this as client component, allows it to interact with the browser and use things like state, window, etc

import React, {useState, useEffect} from "react";
import { Card, Form, Input, Button, Typography } from "antd";
import LoginContent from "@/components/LoginContent";

const tabList = [
    {
      key: 'login',
      tab: 'Log in',
    },
    {
      key: 'signup',
      tab: 'Sign up',
    },
  ];

// might get complicated
// Look into ts by example on antd
const tabContentList: Record<string, React.ReactNode> = { // ts is saying this has keys of type string and values of type ReactNode
    login: 
    <LoginContent />,

    signup: <p>content2</p>,
};

export default function auth_page() {
    // Hold which tab to currently display, will fetch the content from dict using key, TS makes sure only str keys taken
    const[currentTabKey, setCurrentTabKey] = useState<string>("login");

    const onTabChange = (key: string) => {
        setCurrentTabKey(key);
    };

    return (
    <main className="flex min-h-screen flex-col items-center pt-[100px]">
        <Typography.Title level={1}>Spark! Bytes</Typography.Title>
        <Card
        onTabChange={onTabChange}
        tabList={tabList}
        activeTabKey={currentTabKey}
        title="Join us"
        >
            {tabContentList[currentTabKey]}
        </Card>
    </main>
    );
}