import { NextResponse } from "next/server";
import { z } from "zod";
import { userService } from "@/server/services/userService";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const { email, password } = LoginSchema.parse(await req.json());
    const { token, user } = await userService.login(email, password);
    const res = NextResponse.json({ ok: true, user }, { status: 200 });
    res.cookies.set("sb_session", token, {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
      // secure: true // 部署到 HTTPS 时打开
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
