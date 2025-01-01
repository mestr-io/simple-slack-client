import { parseArgs } from 'node:util'
import { color } from 'bun'

interface Command {
  command: 'help' | 'list' | 'sync'
  type?: 'public' | 'private' | 'dm'
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
      }
    }
    // SYNC
    if (values.sync) {
      if (values.type?.startsWith('public')) {
        return { command: 'sync', type: 'public' }
      }
    }
  } catch (error) {
    console.log(color('red', 'ansi'), 'Error parsing input')
    displayHelp(false)
  }
}
