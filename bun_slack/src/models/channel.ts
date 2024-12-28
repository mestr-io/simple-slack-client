import { db } from '../db'
import { channel } from '../db/schema'

import type { InsertChannel } from './types'

const insertChannel = async (channelData: InsertChannel) => {
  const result = await db.insert(channel).values(channelData).returning()
  const { id } = result[0]

  return id
}

export const Channel = { insertChannel }
