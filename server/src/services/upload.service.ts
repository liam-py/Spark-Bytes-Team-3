import path from 'path'
import fs from 'fs'

export const uploadService = {
  getImagePath: (filename: string): string => {
    return `/uploads/events/${filename}`
  },

  deleteImage: (imagePath: string): void => {
    if (imagePath) {
      const filePath = path.join(__dirname, '../../', imagePath)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }
  },
}

