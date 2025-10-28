import { NextResponse } from "next/server";
import { z } from "zod";
import { userService } from "@/server/services/userService";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const { email, password, name } = SignupSchema.parse(await req.json());
    const user = await userService.signup(email, password, name);
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    if (e?.message === "EMAIL_TAKEN") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
