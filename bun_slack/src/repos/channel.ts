import { eq } from 'drizzle-orm'

import { db } from '../db'
import { channel } from '../db/schema'

import type { InsertChannel } from '../models'

const insertChannel = async (channelData: InsertChannel) => {
  const result = await db.insert(channel).values(channelData).returning()
  const { id } = result[0]

  return id
}

const updateChannel = async (channelData: InsertChannel) => {
  const { id, ...updatedChannelData} = channelData
  const result = await db.update(channel).set(updatedChannelData).where(eq(channel.id, id)).returning()

  return result[0].id
}

const listChannels = async (type: string) => {
  const result = await db
    .select({
      id: channel.id,
      name: channel.name,
      created: channel.created,
      updated: channel.updated,
      updatedTs: channel.updatedTs,
    })
    .from(channel)
    .where(eq(channel.type, type))

  return result
}

export const ChannelRepo = { insertChannel, listChannels, updateChannel}
