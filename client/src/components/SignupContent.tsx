import React, {useState} from "react"
import { Typography, Form, Input, Button } from "antd"

export default function SignupContent() {
    const[email, setEmail] = useState("");
    
    return(
        <div>
            <Typography.Text>Sign up with existing email and password</Typography.Text>
            <Form>
                <Form.Item rules={[{ required: true, message: 'Please enter your email' }]} >
                    <Input value={email} onChange ={(e) => (setEmail(e.target.value))} placeholder="email"/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit"></Button>
                </Form.Item>
                {/* space around each? */}
                <Form.Item rules={[{ required: true, message: 'Please enter your password' }]} >
                    <Input value={email} onChange ={(e) => (setEmail(e.target.value))} placeholder="password"/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit"></Button>
                </Form.Item>
            </Form>
        </div>
    );
}