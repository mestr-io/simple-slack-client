import { cliArgs } from './cli-args.ts'
import { ChannelsAPI, UsersAPI } from './api'

const action = cliArgs()

if (action) {
  switch (action.command) {
    case 'list':
      switch (action.type) {
        case 'public':
          await ChannelsAPI.listChannels('public_channel')
          break
        case 'users':
          await UsersAPI.listUsers(action.id)
          break
      }
      break
    case 'sync':
      switch (action.type) {
        case 'public':
          await ChannelsAPI.syncChannels('public_channel')
          break
        case 'users':
          await UsersAPI.syncUsers()
          break
      }
      break
  }
}
