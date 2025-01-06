import { eq } from 'drizzle-orm'
import { db } from '../db'
import { user } from '../db/schema'

import type { InsertUser, SelectUser } from '../models'

const listUsers = async (userId?: string): Promise<SelectUser[]> => {
  let query = db.select().from(user)

  if (userId) {
    query = query.where(eq(user.id, userId))
  }

  const result = await query.execute()
  return result
}

const insertUser = async (userData: InsertUser) => {
  const result = await db.insert(user).values(userData).returning()

  return result[0].id
}

const updateUser = async (UserData: InsertUser) => {
  const { id, ...updatedUserData } = UserData
  const result = await db
    .update(user)
    .set(updatedUserData)
    .where(eq(user.id, id))
    .returning()

  return result[0].id
}

export const UserRepo = { insertUser, listUsers, updateUser }
