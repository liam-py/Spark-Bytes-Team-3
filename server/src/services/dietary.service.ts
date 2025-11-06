import { dietaryRepo } from '../repositories/dietary.repo'

export const dietaryService = {
  async getPreferences(userId: string) {
    return dietaryRepo.findByUserId(userId)
  },

  async updatePreferences(
    userId: string,
    data: {
      isVegan?: boolean
      isVegetarian?: boolean
      isHalal?: boolean
      isKosher?: boolean
      allergies?: string[]
      otherRestrictions?: string
    }
  ) {
    return dietaryRepo.upsert(userId, data)
  },
}

