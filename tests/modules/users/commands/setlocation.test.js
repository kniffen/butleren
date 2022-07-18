import fetchMock from 'node-fetch'

import database from '../../../../database/index.js'
import * as command from '../../../../modules/users/commands/setlocation.js'

describe('modules.users.commands.setlocation', function() {
  let db = null
  let interaction = null

  beforeAll(async function() {
    db = await database

    await db.migrate()
  })

  beforeEach(async function() {
    jest.clearAllMocks()

    fetchMock.mockResolvedValue({status: 200})

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

  it('should contain certain properties', function() {
    expect(command).toEqual({
      data: {
        name: 'setlocation',
        name_localizations: undefined,
        description: 'Set your location',
        description_localizations: undefined,
        default_permission: undefined,
        options: [{
          autocomplete: undefined,
          choices: undefined,
          description: 'Your location name or zip code',
          description_localizations: undefined,
          name: 'location',
          name_localizations: undefined,
          required: true,
          type: 3,  
        }],
      },
      isLocked: true,
      execute: expect.anything()
    })
  })

  it('should set a user\'s location', async function() {
    await command.execute(interaction)

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
    
    await command.execute(interaction)

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ])

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Your location is now set to `location002`\nType `/profile` to view your updated profile.',
      ephemeral: true
    })
  })

  it('should not set the location if it cannot be verified', async function() {
    fetchMock.mockResolvedValue({status: 404})

    await command.execute(interaction)

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

    await command.execute(interaction)

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

    await command.execute(interaction)

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ])

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to set your location.',
      ephemeral: true
    })
  })
})