import DiscordJS from 'discord.js'

import database from '../../../../database/index.js'
import subCommandExecutor from './view.js'

describe('modules.users.commands.profile.view', function() {
  let db = null

  const interactions = [
    {
      user: {
        id: 'user001',
        username: 'username001',
        discriminator: '1234',
        displayAvatarURL: () => 'https://avatar.url'
      },
      reply: jest.fn()
    },
    {
      user: {
        id: 'user002',
        username: 'username002',
        discriminator: '5678',
        displayAvatarURL: () => 'https://avatar.url'
      },
      reply: jest.fn()
    }
  ]

  function createExpectedEmbed(interaction) {
    const expectedEmbed = new DiscordJS.EmbedBuilder()

    expectedEmbed.setAuthor({name: `Profile for ${interaction.user.username}`})
    expectedEmbed.setThumbnail(interaction.user.displayAvatarURL())
    expectedEmbed.setColor('#19D8B4')
    
    expectedEmbed.addFields(
      {name: 'ID',            value: interaction.user.id,            inline: true},
      {name: 'Username',      value: interaction.user.username,      inline: true},
      {name: 'Discriminator', value: interaction.user.discriminator, inline: true}
    )
    
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
    expectedEmbeds[1].addFields({name: 'Location', value: 'location002'})

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