import { cliArgs } from './cli-args.ts'
import { ChannelsAPI } from './api'

const action = cliArgs()

if (action) {
  switch (action.command) {
    case 'list':
      if (action.type?.startsWith('public')) {
        await ChannelsAPI.listChannels('public_channel')
      }
      break
    case 'sync':
      if (action.type?.startsWith('public')) {
        await ChannelsAPI.syncChannels('public_channel')
      }
      break
  }
}
