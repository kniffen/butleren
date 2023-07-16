import { ChatInputCommandInteraction } from 'discord.js';
import { TwitterTweets } from '../../types';
import fetchTwitterUsers from '../../utils/fetchTwitterUsers';
import fetchTwitterUserTweets from '../../utils/fetchTwitterUserTweets';
import latesttweet from './latesttweet';

jest.mock('../../utils/fetchTwitterUsers', () => ({__esModule: true, default: jest.fn()}));
jest.mock('../../utils/fetchTwitterUserTweets', () => ({__esModule: true, default: jest.fn()}));

describe('modules.twitter.commands.twitter.latesttweet()', function() {
  const fetchTwitterUsersMock = fetchTwitterUsers as jest.MockedFunction<typeof fetchTwitterUsers>;
  const fetchTwitterUserTweetsMock = fetchTwitterUserTweets as jest.MockedFunction<typeof fetchTwitterUserTweets>;

  const interaction = {
    options: {
      get: jest.fn()
    },
    deferReply: jest.fn(),
    editReply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  beforeEach(function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    interaction.options.get.mockReturnValue({value: 'userInput001'});

    fetchTwitterUsersMock.mockResolvedValue([
      {id: 'twitterUser001', name: 'twitterUser001_name', username: 'twitterUser001_username'},
      {id: 'twitterUser002', name: 'twitterUser001_name', username: 'twitterUser002_username'},
    ]);

    fetchTwitterUserTweetsMock.mockResolvedValue([
      {id: 'tweet001', created_at: '1970-01-01T00:00:00.000Z'},
      {id: 'tweet002', created_at: '1990-01-01T00:32:00.000Z'},
      {id: 'tweet003', created_at: '1980-01-01T01:00:00.000Z'},
    ] as TwitterTweets['data']);

    jest.clearAllMocks();
  });

  afterAll(function() {
    jest.restoreAllMocks();
  });

  it('Should respond with the latest tweet from a twitter user', async function() {
    await latesttweet(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(fetchTwitterUsersMock).toHaveBeenCalledWith({usernames: ['userInput001']});
    expect(fetchTwitterUserTweetsMock).toHaveBeenCalledWith('twitterUser001');
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Latest tweet from twitterUser001_name\nhttps://twitter.com/twitterUser001_username/status/tweet002'
    });
  });

  it('Should handle various inputs', async function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    interaction.options.get.mockReturnValue({value: '@userInput001'});
    await latesttweet(interaction);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    interaction.options.get.mockReturnValue({value: 'userInput001 foo bar'});
    await latesttweet(interaction);

    expect(interaction.deferReply).toHaveBeenCalledTimes(2);
    expect(fetchTwitterUsersMock).toHaveBeenNthCalledWith(1, {usernames: ['userInput001']});
    expect(fetchTwitterUsersMock).toHaveBeenNthCalledWith(2, {usernames: ['userInput001']});
  });

  it('Should respond with a specific message if the twitter user has no tweets', async function() {
    fetchTwitterUserTweetsMock.mockResolvedValue([]);

    await latesttweet(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'twitterUser001_name does not appear to have any public tweets\nhttps://twitter.com/twitterUser001_username',
    });
  });

  it('Should respond with a specific message if the twitter user does not exist', async function() {
    fetchTwitterUsersMock.mockResolvedValue([]);

    await latesttweet(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Sorry, i was unable to find "@userInput001" on Twitter :(',
    });
  });
});