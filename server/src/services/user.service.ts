import { userRepo } from '../repositories/user.repo'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export const userService = {
  async signup(email: string, password: string, name?: string) {
    const exist = await userRepo.findByEmail(email)
    if (exist) throw new Error('EMAIL_TAKEN')
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await userRepo.create({ email, name, passwordHash })
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
  },

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email)
    if (!user) throw new Error('INVALID_CREDENTIALS')
    const ok = await bcrypt.compare(password, (user as any).passwordHash)
    if (!ok) throw new Error('INVALID_CREDENTIALS')
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    const publicUser = { id: user.id, email: user.email, name: user.name }
    return { token, user: publicUser }
  },

  async getPublicUser(id: string) {
    return userRepo.findByIdPublic(id)
  },
}
