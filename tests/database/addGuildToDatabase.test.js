import database from '../../database/index.js'
import addGuildToDatabase from '../../database/addGuildToDatabase.js'

describe('database.addGuildToDatabase()', function() {
  let db = null

  const guild = {
    id: 'guild001'
  }

  beforeAll(async function() {
    db = await database

    await db.migrate()

    // Running twice to ensure the guild only gets added once
    await addGuildToDatabase(guild)
    await addGuildToDatabase(guild)
  })

  afterAll(function() {
    db.close()
  })
  
  it('should add guild settings to the database', async function() {
    expect(await db.all('SELECT * from guilds')).toEqual([{
      id: 'guild001',
      nickname: null,
      color: '#19D8B4',
      timezone: 'UTC',
    }])
  })

  it('should add modules to the database', async function() {
    const entries = await db.all('SELECT * from modules')
    entries.sort((a, b) => a.id.localeCompare(b.id))
    
    expect(entries).toEqual([
      {id: 'cleverbot', guildId: 'guild001', isEnabled: 0},
      {id: 'fun',       guildId: 'guild001', isEnabled: 0},
      {id: 'spotify',   guildId: 'guild001', isEnabled: 0},
      {id: 'twitter',   guildId: 'guild001', isEnabled: 0},
      {id: 'weather',   guildId: 'guild001', isEnabled: 0},
    ])
  })

  it('should handle updating the database being rejected', async function() {
    jest.spyOn(db, 'run').mockRejectedValue('SQL error')
    await addGuildToDatabase(guild)

    expect(console.error).toHaveBeenCalledTimes(6)
    expect(console.error).toHaveBeenCalledWith('SQL error')

    db.run.mockRestore()
  })
})