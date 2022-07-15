import database from '../../../../database/index.js'
import * as command from '../../../../modules/users/commands/deleteprofile.js'

describe('modules.users.commands.deleteprofile', function() {
  let db = null
  let interaction = null

  beforeAll(async function() {
    db = await database

    await db.migrate()
  })

  beforeEach(async function() {
    jest.clearAllMocks()

    interaction = {
      user: {
        id: 'user001'
      },
      reply: jest.fn()
    }

    await db.run('INSERT OR IGNORE INTO users (id, location) VALUES (?,?)', ['user001', 'location001'])
    await db.run('INSERT OR IGNORE INTO users (id, location) VALUES (?,?)', ['user002', 'location002'])
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('should contain certain properties', function() {
    expect(command).toEqual({
      data: {
        name: 'deleteprofile',
        name_localizations: undefined,
        description: 'Remove all your data from the Bot\'s database',
        description_localizations: undefined,
        default_permission: undefined,
        options: [],
      },
      isLocked: true,
      execute: expect.anything()
    })
  })

  it('should remove a user\'s data from the database', async function() {
    await command.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Your data has been deleted from the bot\'s database.',
      ephemeral: true
    })

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user002', location: 'location002'}
    ])
  })

  it('should handle the user not existing in the database', async function() {
    interaction.user.id = 'user999'

    await command.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'You currently do not have any data stored in the bot\'s database.',
      ephemeral: true
    })

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user002', location: 'location002'},
      {id: 'user001', location: 'location001'},
    ])
  })

  it('should handle reading from the database being rejected', async function() {
    jest.spyOn(db, 'get').mockRejectedValue('Error message')

    await command.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to delete your data from the bot\'s database.',
      ephemeral: true
    })

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user002', location: 'location002'},
      {id: 'user001', location: 'location001'},
    ])

    db.get.mockRestore()
  })
  
  it('should handle deleting from the database being rejected', async function() {
    jest.spyOn(db, 'run').mockRejectedValue('Error message')

    await command.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to delete your data from the bot\'s database.',
      ephemeral: true
    })

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user002', location: 'location002'},
      {id: 'user001', location: 'location001'},
    ])
  })
})