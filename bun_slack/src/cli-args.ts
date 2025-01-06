import { parseArgs } from 'node:util'
import { color } from 'bun'

interface Command {
  command: 'help' | 'list' | 'sync'
  type?: 'public' | 'private' | 'dm' | 'users'
  id?: string
}

const displayHelp = (showHeader = true) => {
  if (showHeader) {
    console.log(color('green', 'ansi'), 'B·A·L·E·N·A')
    console.log(
      color('black', 'ansi'),
      'Manage data from your slack integration. Sync all your data locally',
    )
  }
  const commands = `
--help      Help
--list      List current type on local DB
--type      Sets type to work on
--sync      Syncs current type from API to local DB
--id        Sets current id of the entity
`

  console.log(color('black', 'ansi'), commands)
}

export const cliArgs = (): Command | undefined => {
  try {
    const { values } = parseArgs({
      args: Bun.argv,
      options: {
        help: {
          type: 'boolean',
          short: 'h',
        },
        list: {
          type: 'boolean',
          short: 'l',
        },
        sync: {
          type: 'boolean',
          short: 's',
        },
        type: {
          type: 'string',
          short: 't',
        },
        id: {
          type: 'string',
          short: 'i',
        },
      },
      strict: true,
      allowPositionals: true,
    })

    if (values.help) {
      displayHelp()
    }

    // LIST
    if (values.list) {
      if (!values.type) {
        console.log(
          color('red', 'ansi'),
          'Need the entity type to list e.g --type public_channel',
        )
      } else {
        if (values.type.startsWith('public')) {
          return { command: 'list', type: 'public' }
        }
        if (values.type.startsWith('private')) {
          return { command: 'list', type: 'private' }
        }
        if (values.type.startsWith('user')) {
          return { command: 'list', type: 'users', id: values.id }
        }
      }
    }
    // SYNC
    if (values.sync) {
      if (values.type?.startsWith('public')) {
        return { command: 'sync', type: 'public' }
      }
      if (values.type?.startsWith('user')) {
        return { command: 'sync', type: 'users', id: values.id }
      }
    }
  } catch (error) {
    console.log(color('red', 'ansi'), 'Error parsing input')
    displayHelp(false)
  }
}
