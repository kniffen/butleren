import fetchMock from 'node-fetch'

import database from '../../../../database/index.js'
import subCommandExecutor from './setlocation.js'

describe('modules.users.commands.profile.setlocation', function() {
  let db = null
  let interaction = null

  beforeAll(async function() {
    db = await database

    await db.migrate()
  })

  beforeEach(async function() {
    jest.clearAllMocks()

    fetchMock.mockResolvedValue({ok: true})

    interaction = {
      user: {
        id: 'user001'
      },
      options: {
        get: () => ({value: 'location001'})
      },
      reply: jest.fn()
    }
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('should set a user\'s location', async function() {
    await subCommandExecutor(interaction)

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location001'}
    ])

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Your location is now set to `location001`\nType `/profile` to view your updated profile.',
      ephemeral: true
    })
  })

  it('should update a user\'s location', async function() {
    interaction.options.get = () => ({value: 'location002'})
    
    await subCommandExecutor(interaction)

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ])

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Your location is now set to `location002`\nType `/profile` to view your updated profile.',
      ephemeral: true
    })
  })

  it('should not set the location if it cannot be verified', async function() {
    fetchMock.mockResolvedValue({ok: false})

    await subCommandExecutor(interaction)

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ])

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to verify that location.',
      ephemeral: true
    })
  })

  it('should handle reading from the database being rejected', async function() {
    jest.spyOn(db, 'get').mockRejectedValue('Error message')
    interaction.options.get = () => ({value: 'location999'})

    await subCommandExecutor(interaction)

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ])

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to set your location.',
      ephemeral: true
    })

    db.get.mockRestore()
  })

  it('should handle writing to the database being rejected', async function() {
    jest.spyOn(db, 'run').mockRejectedValue('Error message')
    interaction.options.get = () => ({value: 'location999'})

    await subCommandExecutor(interaction)

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ])

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to set your location.',
      ephemeral: true
    })
  })
})