import { prisma } from '../lib/db'

export const dietaryRepo = {
  findByUserId: (userId: string) => {
    return prisma.dietaryPrefs.findUnique({
      where: { userId },
    })
  },

  create: (data: {
    userId: string
    isVegan?: boolean
    isVegetarian?: boolean
    isHalal?: boolean
    isKosher?: boolean
    allergies?: string[]
    otherRestrictions?: string
  }) => {
    return prisma.dietaryPrefs.create({
      data: {
        userId: data.userId,
        isVegan: data.isVegan || false,
        isVegetarian: data.isVegetarian || false,
        isHalal: data.isHalal || false,
        isKosher: data.isKosher || false,
        allergies: data.allergies || [],
        otherRestrictions: data.otherRestrictions,
      },
    })
  },

  update: (userId: string, data: {
    isVegan?: boolean
    isVegetarian?: boolean
    isHalal?: boolean
    isKosher?: boolean
    allergies?: string[]
    otherRestrictions?: string
  }) => {
    return prisma.dietaryPrefs.update({
      where: { userId },
      data: {
        isVegan: data.isVegan,
        isVegetarian: data.isVegetarian,
        isHalal: data.isHalal,
        isKosher: data.isKosher,
        allergies: data.allergies,
        otherRestrictions: data.otherRestrictions,
      },
    })
  },

  upsert: (userId: string, data: {
    isVegan?: boolean
    isVegetarian?: boolean
    isHalal?: boolean
    isKosher?: boolean
    allergies?: string[]
    otherRestrictions?: string
  }) => {
    return prisma.dietaryPrefs.upsert({
      where: { userId },
      update: {
        isVegan: data.isVegan,
        isVegetarian: data.isVegetarian,
        isHalal: data.isHalal,
        isKosher: data.isKosher,
        allergies: data.allergies,
        otherRestrictions: data.otherRestrictions,
      },
      create: {
        userId,
        isVegan: data.isVegan || false,
        isVegetarian: data.isVegetarian || false,
        isHalal: data.isHalal || false,
        isKosher: data.isKosher || false,
        allergies: data.allergies || [],
        otherRestrictions: data.otherRestrictions,
      },
    })
  },
}

