import { WebClient, LogLevel } from '@slack/web-api'

import type { ConversationsListResponse } from '@slack/web-api'

import { Channel } from './models/channel.ts'
import type { InsertChannel } from './models/types.ts'

export const syncChannels = async () => {
  const token = process.env.SLACK_TOKEN

  if (!token) {
    throw new Error('SLACK_TOKEN environment variable is required')
  }
  const webClient = new WebClient(token, {
    // logLevel: LogLevel.DEBUG,
    logLevel: LogLevel.INFO,
  })

  const channelsResponse: ConversationsListResponse =
    await webClient.conversations.list({ types: 'public_channel' })

  if (channelsResponse.channels) {
    for (const channel of channelsResponse.channels) {
      const createdTs = new Date(Number(channel.created) * 1000)
      const updatedTs = new Date(Number(channel.updated))

      const channelData: InsertChannel = {
        id: channel.id,
        name: channel.name,
        type: 'public_channel',
        createdTs: createdTs,
        updatedTs: updatedTs,
        created: createdTs.toISOString(),
        updated: updatedTs.toISOString(),
        body: channel,
      }

      const result = await Channel.insertChannel(channelData)
      console.log(`Channel ${channel.name} inserted with ID: ${result}`)
    }
  }
}

export const listChannels = async () => {
  const result = await Channel.listChannels()
  console.log(result)
}
