import { userRepo } from "../repositories/userRepo";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";

export const userService = {
  async signup(email: string, password: string, name?: string) {
    const exist = await userRepo.findByEmail(email);
    if (exist) throw new Error("EMAIL_TAKEN");
    const passwordHash = await hashPassword(password);
    const user = await userRepo.create({ email, name, passwordHash });
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  },

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("INVALID_CREDENTIALS");
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw new Error("INVALID_CREDENTIALS");
    const token = signToken({ userId: user.id, email: user.email });
    const publicUser = { id: user.id, email: user.email, name: user.name };
    return { token, user: publicUser };
  },

  async getPublicUser(id: string) {
    return userRepo.findByIdPublic(id);
  },
};
