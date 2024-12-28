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
