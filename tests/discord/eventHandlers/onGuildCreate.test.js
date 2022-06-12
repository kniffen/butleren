import database from '../../../database/index.js'
import onGuildCreate from '../../../discord/eventHandlers/onGuildCreate.js'

describe('discord.eventHandlers.onGuildCreate()', function() {
  let db = null

  const guild = {
    id: 'guild001',
    commands: {create: jest.fn()}
  }

  beforeAll(async function() {
    db = await database

    await db.migrate()
  })

  afterAll(function() {
    db.close()
  })

  it('should add guild settings to the database', async function() {
    // Running twice to ensure the guild only gets added once
    await onGuildCreate(guild)
    await onGuildCreate(guild)

    expect(await db.all('SELECT * from guilds')).toEqual([{
      id: 'guild001',
      nickname: null,
      color: '#19D8B4',
      timezone: 'UTC',
    }])
  })

  it('should handle updating the database being rejected', async function() {
    jest.spyOn(db, 'run').mockRejectedValue('SQL error')
    await onGuildCreate(guild)

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith('SQL error')

    db.run.mockRestore()
  })
})