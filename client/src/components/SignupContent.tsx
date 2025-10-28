import React, {useState} from "react"
import { Typography, Form, Input, Button } from "antd"

export default function SignupContent() {
    const[email, setEmail] = useState<string>("");
    const[password, setPassword] = useState<string>("");

    function handleSubmit() {
        // if email is valid
        // if password is valid
        // post call to API
        console.log("Signup form submitted!")
    }
    
    return(
        <div>
            <Typography.Text>Create a new account</Typography.Text>
            <Form onFinish={handleSubmit}>
                <Form.Item rules={[{ required: true, message: 'Please enter your email' }]} >
                    <Input value={email} onChange ={(e) => (setEmail(e.target.value))} placeholder="email"/>
                </Form.Item>
                {/* Space around each? */}
                <Form.Item rules={[{ required: true, message: 'Please enter your password' }]} >
                    <Input value={password} onChange ={(e) => (setPassword(e.target.value))} placeholder="password"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Sign up</Button>
                </Form.Item>
            </Form>
        </div>
    );
}