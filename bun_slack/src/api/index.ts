import { WebClient, LogLevel } from '@slack/web-api'

const token = process.env.SLACK_TOKEN

if (!token) {
  throw new Error('SLACK_TOKEN environment variable is required')
}

export const webClient = new WebClient(token, {
  // logLevel: LogLevel.DEBUG,
  logLevel: LogLevel.INFO,
})

export { ChannelsAPI } from './channels.ts'
