import type { UsersListResponse } from '@slack/web-api'

import { webClient } from '.'
import { UserRepo } from '../repos'
import type { InsertUser, SelectUser } from '../models'

const syncUsers = async () => {
  const usersResponse = await webClient.users.list()

  if (usersResponse.members) {
    const usersDBList = await UserRepo.listUsers()

    // users from DB
    const idCachedList = usersDBList.map((user) => ({
      id: user.id,
      updatedTs: user.updatedTs,
    }))

    // New users (in API but not in DB)
    const newUsers = usersResponse.members.filter(
      (apiUser) => !idCachedList.some((dbUser) => dbUser.id === apiUser.id),
    )

    // Updated users (same ID but different updated timestamp)
    const updatedUsers = usersResponse.members.filter((apiUser) => {
      const dbUser = idCachedList.find((db) => db.id === apiUser.id)
      return (
        dbUser && Number(dbUser.updatedTs) !== Number(apiUser.updated) * 1000
      )
    })

    // add users
    for (const user of newUsers) {
      const updatedTs = new Date(Number(user.updated) * 1000)

      const userData: InsertUser = {
        id: user.id,
        teamId: user.team_id,
        name: user.name,
        realName: user.real_name,
        updatedTs: updatedTs,
        updated: updatedTs.toISOString(),
        body: user,
      }

      const result = await UserRepo.insertUser(userData)
      console.log(`User ${user.name} inserted with ID: ${result}`)
    }

    for (const user of updatedUsers) {
      const updatedTs = new Date(Number(user.updated) * 1000)

      const userData: InsertUser = {
        id: user.id,
        teamId: user.team_id,
        name: user.name,
        realName: user.real_name,
        updatedTs: updatedTs,
        updated: updatedTs.toISOString(),
        body: user,
      }

      const result = await UserRepo.updateUser(userData)
      console.log(`User ${user.name} updated with ID: ${result}`)
    }
    console.log(`Total users from API: ${usersResponse.members.length}`)
    console.log(`Total users to create: ${newUsers.length}`)
    console.log(`Total users to update: ${updatedUsers.length}`)
  }
}

const listUsers = async (userId: string | undefined): Promise<void> => {
  const result = await UserRepo.listUsers(userId)
  console.log(JSON.stringify(result, null, 2))
}

export const UsersAPI = { listUsers, syncUsers }
