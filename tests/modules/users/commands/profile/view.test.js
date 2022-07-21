import DiscordJS from 'discord.js'

import database from '../../../../../database/index.js'
import subCommandExecutor from '../../../../../modules/users/commands/profile/view.js'

describe('modules.users.commands.profile.view', function() {
  let db = null

  const interactions = [
    {
      user: {
        id: 'user001',
        username: 'username001',
        discriminator: '1234',
        displayAvatarURL: () => 'avatar.url'
      },
      reply: jest.fn()
    },
    {
      user: {
        id: 'user002',
        username: 'username002',
        discriminator: '5678',
        displayAvatarURL: () => 'avatar.url'
      },
      reply: jest.fn()
    }
  ]

  function createExpectedEmbed(interaction) {
    const expectedEmbed = new DiscordJS.MessageEmbed()

    expectedEmbed.setAuthor({name: `Profile for ${interaction.user.username}`})
    expectedEmbed.setThumbnail(interaction.user.displayAvatarURL())
    expectedEmbed.setColor('#19D8B4')
    
    expectedEmbed.addField('ID', interaction.user.id, true)
    expectedEmbed.addField('Username', interaction.user.username, true)
    expectedEmbed.addField('Discriminator', interaction.user.discriminator, true)
    
    return expectedEmbed
  }

  beforeAll(async function() {
    db = await database

    await db.migrate()
    await db.run('INSERT INTO users (id, location) VALUES (?,?)', ['user002', 'location002'])
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  it('should respond with an embed of the user\'s profile', async function() {
    const expectedEmbeds = interactions.map(interaction => createExpectedEmbed(interaction))
    expectedEmbeds[1].addField('Location', 'location002')

    await subCommandExecutor(interactions[0])
    await subCommandExecutor(interactions[1])
    
    expect(interactions[0].reply).toHaveBeenCalledWith({
      embeds: [expectedEmbeds[0]],
      ephemeral: true
    })

    expect(interactions[1].reply).toHaveBeenCalledWith({
      embeds: [expectedEmbeds[1]],
      ephemeral: true
    })
  })
  
  it('should handle reading from the database being rejected', async function() {
    jest.spyOn(db, 'get').mockRejectedValue('Error message')

    const expectedEmbed = createExpectedEmbed(interactions[1])

    await subCommandExecutor(interactions[1])

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(interactions[1].reply).toHaveBeenCalledWith({
      embeds: [expectedEmbed],
      ephemeral: true
    })
  })
})