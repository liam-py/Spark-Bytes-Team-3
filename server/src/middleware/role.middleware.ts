import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware'
import { userRepo } from '../repositories/user.repo'

export const requireOrganizer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const user = await userRepo.findById(req.userId)
    if (!user || !user.isOrganizer) {
      return res.status(403).json({ error: 'Only verified organizers can perform this action' })
    }
    next()
  } catch {
    return res.status(500).json({ error: 'Error verifying organizer status' })
  }
}

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const user = await userRepo.findById(req.userId)
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  } catch {
    return res.status(500).json({ error: 'Error verifying admin status' })
  }
}

export const requireAdminOrOrganizer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const user = await userRepo.findById(req.userId)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    if (user.role !== 'ADMIN' && !user.isOrganizer) {
      return res.status(403).json({ error: 'Admin or organizer access required' })
    }
    next()
  } catch {
    return res.status(500).json({ error: 'Error verifying access' })
  }
}
