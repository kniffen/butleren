import DiscordJS from 'discord.js'

import fetchTwitchUsersMock from '../../../../../modules/twitch/utils/fetchTwitchUsers.js'
import fetchTwitchScheduleMock from '../../../../../modules/twitch/utils/fetchTwitchSchedule.js'
import execute from '../../../../../modules/twitch/commands/twitch/schedule.js'

jest.mock(
  '../../../../../modules/twitch/utils/fetchTwitchUsers.js',
  () => ({__esModule: true, default: jest.fn()})
)

jest.mock(
  '../../../../../modules/twitch/utils/fetchTwitchSchedule.js',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.twitch.commands.twitch.schedule()', function() {
  const interaction = {
    options: {
      get: () => ({value: 'Foo Bar Baz'})
    },
    deferReply: jest.fn(),
    editReply: jest.fn()
  }

  beforeAll(async function() {
    fetchTwitchUsersMock.mockImplementation(async ({ usernames }) => usernames.map(username => ({
      id:                `${username}_id`,
      login:             `${username}_login`,
      display_name:      `${username}_display_name`,
      profile_image_url: `https://${username}_profile_image_url`,
    })))

    fetchTwitchScheduleMock.mockResolvedValue([
      {title: 'foo', start_time: '2000-01-01T00:00:00Z', category: {name: 'category_name'}},
      {start_time: '2000-01-01T10:00:00Z', category: {name: 'category_name'}},
      {title: 'bar', start_time: '2000-01-01T20:00:00Z'},
      {title: 'baz', start_time: '2000-01-01T22:00:00Z', category: {name: 'category_name'}},
    ])
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should respond with a channel\'s stream schedule', async function() {
    const expectedEmbed = new DiscordJS.EmbedBuilder()
    expectedEmbed.setTitle('Stream schedule for foo_display_name')
    expectedEmbed.setColor('#9146FF')
    expectedEmbed.setURL('https://twitch.tv/foo_login/schedule')
    expectedEmbed.setThumbnail('https://foo_profile_image_url')
    expectedEmbed.setFooter({text: 'Times are in your local timezone'})
    expectedEmbed.addFields(
      {name: '<t:946684800>', value: 'foo (category_name)'},
      {name: '<t:946720800>', value: 'Untitled (category_name)'},
      {name: '<t:946756800>', value: 'bar'}
    )

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitchUsersMock).toHaveBeenCalledWith({usernames: ['foo']})
    expect(fetchTwitchScheduleMock).toHaveBeenCalledWith({id: 'foo_id'})
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('Should reply with an ephemeral message if the channel does not have a schedule', async function() {
    fetchTwitchScheduleMock.mockResolvedValue([])

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitchUsersMock).toHaveBeenCalledWith({usernames: ['foo']})
    expect(fetchTwitchScheduleMock).toHaveBeenCalledWith({id: 'foo_id'})
    expect(interaction.editReply).toHaveBeenCalledWith({
      content:   'foo_display_name does not appear to have a schedule configured',
      ephemeral: true
    })
  })

  it.todo('Should handle the reply failing to be sent')
  
  it('Should respond with a fallback message if the channel cannot be found', async function() {
    fetchTwitchUsersMock.mockResolvedValue([])

    await execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).not.toHaveBeenCalled()
    expect(fetchTwitchUsersMock).toHaveBeenCalledWith({usernames: ['foo']})
    expect(fetchTwitchScheduleMock).not.toHaveBeenCalled()
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Sorry, i was unable to find "Foo" on twitch :(',
      ephemeral: true
    })
  })
})