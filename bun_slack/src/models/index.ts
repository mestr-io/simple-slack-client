import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

import type { channel } from '../db/schema'

export type SelectChannel = InferSelectModel<typeof channel>
export type InsertChannel = InferInsertModel<typeof channel>
