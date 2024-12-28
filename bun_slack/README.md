# BUNSLACK

## A very simple slack spider

## Install

### BUN is required

[BUN project](https://bun.sh)

To install dependencies:

```bash
bun install
```

## Run

Add a `.env` file with the slack token and the name of your local DB

```env
SLACK_TOKEN=xoxb-2720925690595...
DB=db.sqlite
```

```bash
bun run index.ts
# or
bun run start
```

## Running migrations

Run `bun migrate.ts` from root directory

## Linting and formatting

This project uses [BIOME tools](https://biomejs.dev/), setup your editor or toolchain accordingly
