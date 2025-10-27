import React, {useState} from "react"
import { Typography, Form, Input, Button } from "antd"

export default function LoginContent() {
    const[email, setEmail] = useState("");
    
    return(
        <div>
            <Typography.Text>Log in with existing email and password</Typography.Text>
            <Form>
                <Form.Item rules={[{ required: true, message: 'Please enter your email' }]} >
                    <Input value={email} onChange ={(e) => (setEmail(e.target.value))} placeholder="Enter your email"/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit"></Button>
                </Form.Item>
            </Form>
        </div>
    );
}