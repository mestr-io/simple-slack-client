import type { ConversationsListResponse } from '@slack/web-api'

import { webClient } from '.'
import { ChannelRepo } from '../repos'
import type { InsertChannel } from '../models'

const syncChannels = async (channelType: string) => {
  const channelsResponse: ConversationsListResponse =
    await webClient.conversations.list({ types: channelType })

  if (channelsResponse.channels) {
    const channelsDBList = await ChannelRepo.listChannels(channelType)

    // channels from DB
    const idCachedList = channelsDBList.map((channel) => ({
      id: channel.id,
      updatedTs: channel.updatedTs,
    }))

    // New channels (in API but not in DB)
    const newChannels = channelsResponse.channels.filter(
      (apiChannel) =>
        !idCachedList.some((dbChannel) => dbChannel.id === apiChannel.id),
    )

    // Updated channels (same ID but different updated timestamp)
    const updatedChannels = channelsResponse.channels.filter((apiChannel) => {
      const dbChannel = idCachedList.find((db) => db.id === apiChannel.id)
      return dbChannel && Number(dbChannel.updatedTs) !== apiChannel.updated
    })

    // add channels
    for (const channel of newChannels) {
      const createdTs = new Date(Number(channel.created) * 1000)
      const updatedTs = new Date(Number(channel.updated))

      const channelData: InsertChannel = {
        id: channel.id,
        name: channel.name,
        type: channelType,
        createdTs: createdTs,
        updatedTs: updatedTs,
        created: createdTs.toISOString(),
        updated: updatedTs.toISOString(),
        body: channel,
      }

      const result = await ChannelRepo.insertChannel(channelData)
      console.log(`Channel ${channel.name} inserted with ID: ${result}`)
    }

    for (const channel of updatedChannels) {
      const createdTs = new Date(Number(channel.created) * 1000)
      const updatedTs = new Date(Number(channel.updated))

      const channelData: InsertChannel = {
        id: channel.id,
        name: channel.name,
        type: channelType,
        createdTs: createdTs,
        updatedTs: updatedTs,
        created: createdTs.toISOString(),
        updated: updatedTs.toISOString(),
        body: channel,
      }

      const result = await ChannelRepo.updateChannel(channelData)
      console.log(`Channel ${channel.name} updated with ID: ${result}`)
    }

    console.log(`Total channels from API: ${channelsResponse.channels.length}`)
    console.log(`Total channels to create: ${newChannels.length}`)
    console.log(`Total channels to update: ${updatedChannels.length}`)
  }
}

const listChannels = async (type: string) => {
  const result = await ChannelRepo.listChannels(type)
  console.log(result)
}

export const ChannelsAPI = { listChannels, syncChannels }
