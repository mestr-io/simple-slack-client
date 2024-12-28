import { db } from '../db'
import { channel } from '../db/schema'

import type { InsertChannel } from './types'

const insertChannel = async (channelData: InsertChannel) => {
  const result = await db.insert(channel).values(channelData).returning()
  const { id } = result[0]

  return id
}

const listChannels = async () => {
  const result = await db
    .select({
      id: channel.id,
      name: channel.name,
      created: channel.created,
      updated: channel.updated,
    })
    .from(channel)

  return result
}

export const Channel = { insertChannel, listChannels }
