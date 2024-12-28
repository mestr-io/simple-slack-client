import { defineConfig } from 'drizzle-kit'
// import { drizzle } from 'drizzle-orm/bun-sqlite'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./db.sqlite',
  },
  verbose: true,
})
