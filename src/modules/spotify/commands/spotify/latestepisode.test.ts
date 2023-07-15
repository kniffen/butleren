import { ChatInputCommandInteraction } from 'discord.js';
import { fetchSpotifySearch } from '../../utils/fetchSpotifySearch';
import { fetchSpotifyShowEpisodes } from '../../utils/fetchSpotifyShowEpisodes';
import { latestEpisodeSubCommand } from './latestepisode';

jest.mock(
  '../../utils/fetchSpotifySearch',
  () => ({ __esModule: true, fetchSpotifySearch: jest.fn() })
);

jest.mock(
  '../../utils/fetchSpotifyShowEpisodes',
  () => ({ __esModule: true, fetchSpotifyShowEpisodes: jest.fn() })
);

describe('modules.spotify.commands.spotify.latestepisode()', function () {
  const fetchSpotifySearchMock = fetchSpotifySearch as jest.MockedFunction<typeof fetchSpotifySearch>;
  const fetchSpotifyShowEpisodesMock = fetchSpotifyShowEpisodes as jest.MockedFunction<typeof fetchSpotifyShowEpisodes>;

  const interaction = {
    options: {
      get: () => ({ value: 'userInput001' })
    },
    deferReply: jest.fn(),
    editReply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  beforeAll(async function () {
    fetchSpotifySearchMock.mockResolvedValue({
      shows: {
        items: [
          { id: 'show001', name: 'showName001', external_urls: { spotify: 'spotifyShowURL001' } },
          { id: 'show002', name: 'showName002', external_urls: { spotify: 'spotifyShowURL002' } },
        ]
      }
    } as unknown as SpotifySearchResult);

    fetchSpotifyShowEpisodesMock.mockResolvedValue([
      { release_date: '1970-01-01', external_urls: { spotify: 'spotifyEpisodeURL001' } },
      { release_date: '2020-05-06', external_urls: { spotify: 'spotifyEpisodeURL002' } },
      { release_date: '1980-02-03', external_urls: { spotify: 'spotifyEpisodeURL003' } },
    ] as SpotifyShowEpisodes['items']);
  });

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should respond with the latest episode for a show', async function () {
    await latestEpisodeSubCommand(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Latest episode from showName001\nspotifyEpisodeURL002'
    });
  });

  it('Should respond with a specific message if the show has no episodes', async function () {
    fetchSpotifyShowEpisodesMock.mockResolvedValue([]);

    await latestEpisodeSubCommand(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'showName001 does not appear to have any recent episodes\nspotifyShowURL001',
    });
  });

  it('Should respond with a specific message if the show does not exist', async function () {
    fetchSpotifySearchMock.mockResolvedValue({} as SpotifySearchResult);

    await latestEpisodeSubCommand(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to fetch that show for you :(',
    });
  });
});