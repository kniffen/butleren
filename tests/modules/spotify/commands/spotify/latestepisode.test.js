import database from '../../../../../database/index.js'
import fetchSpotifySearchMock from '../../../../../modules/spotify/utils/fetchSpotifySearch.js'
import fetchSpotifyShowEpisodesMock from '../../../../../modules/spotify/utils/fetchSpotifyShowEpisodes.js'
import latestepisode from '../../../../../modules/spotify/commands/spotify/latestepisode.js'

jest.mock(
  '../../../../../modules/spotify/utils/fetchSpotifySearch',
  () => ({__esModule: true, default: jest.fn()})
)

jest.mock(
  '../../../../../modules/spotify/utils/fetchSpotifyShowEpisodes',
  () => ({__esModule: true, default: jest.fn()})
)

describe('modules.spotify.commands.spotify.latestepisode()', function() {
  let db = null
  
  const interaction = {
    options: {
      get: () => ({values: 'userInput001'})
    },
    reply: jest.fn()
  }

  beforeAll(async function() {
    db = await database

    fetchSpotifySearchMock.mockResolvedValue([
      {id: 'show001', name: 'showName001', external_urls: {spotify: 'spotifyShowURL001'}},
      {id: 'show002', name: 'showName002', external_urls: {spotify: 'spotifyShowURL002'}},
    ])

    fetchSpotifyShowEpisodesMock.mockResolvedValue([
      {release_date: '1970-01-01', external_urls: {spotify: 'spotifyEpisodeURL001'}},
      {release_date: '2020-05-06', external_urls: {spotify: 'spotifyEpisodeURL002'}},
      {release_date: '1980-02-03', external_urls: {spotify: 'spotifyEpisodeURL003'}},
    ])
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
  })

  it('Should respond with the latest episode for a show', async function() {
    await latestepisode(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Latest episode from showName001\nspotifyEpisodeURL002'
    })
  })

  it('Should respond with a specific message if the show has no episodes', async function() {
    fetchSpotifyShowEpisodesMock.mockResolvedValue([])

    await latestepisode(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'showName001 does not appear to have any recent episodes\nspotifyShowURL001',
      ephemeral: true
    })
  })

  it('Should respond with a specific message if the show does not exist', async function() {
    fetchSpotifySearchMock.mockResolvedValue([])

    await latestepisode(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to fetch that show for you :(',
      ephemeral: true
    })
  })
})