import React, {useState} from "react"
import { Typography, Form, Input, Button } from "antd"

export default function LoginContent() {
    const[email, setEmail] = useState<string>("");
    const[password, setPassword] = useState<string>("")

    function handleSubmit() {
        // if email is valid
        // if password is valid
        // update user state?
        console.log("Login form submitted!")
    }
    
    return(
        <div>
            <Typography.Text>Enter existing email and password</Typography.Text>
            <Form onFinish={handleSubmit}>
                <Form.Item rules={[{ required: true, message: 'Please enter your email' }]} >
                    <Input value={email} onChange ={(e) => (setEmail(e.target.value))} placeholder="email"/>
                </Form.Item>
                <Form.Item rules={[{ required: true, message: 'Please enter your password' }]} >
                    <Input value={password} onChange ={(e) => (setPassword(e.target.value))} placeholder="password"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Log in</Button>
                </Form.Item>
            </Form>
        </div>
    );
}