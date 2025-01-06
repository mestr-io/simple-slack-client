import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const channel = sqliteTable('channels', {
  id: text().unique(),
  name: text(),
  type: text(),
  createdTs: integer('created_ts', { mode: 'timestamp' }),
  updatedTs: integer('updated_ts', { mode: 'timestamp_ms' }),
  created: text(),
  updated: text(),
  body: text({ mode: 'json' }),
})

export const user = sqliteTable('users', {
  id: text().unique(),
  teamId: text(),
  name: text(),
  realName: text(),
  updatedTs: integer({ mode: 'timestamp' }),
  updated: text(),
  body: text({ mode: 'json' }),
})
