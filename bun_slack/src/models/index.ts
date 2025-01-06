import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

import type { channel, user } from '../db/schema'

export type SelectChannel = InferSelectModel<typeof channel>
export type InsertChannel = InferInsertModel<typeof channel>

export type SelectUser = InferSelectModel<typeof user>
export type InsertUser = InferInsertModel<typeof user>
