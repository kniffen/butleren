import type { Request, Response } from 'express';
import type { YouTubeAPISearchResult } from '../../modules/youtube/requests/getYouTubeSearch';
import type { KickAPIChannel } from '../../modules/kick/requests/getKickChannels';
import type { TwitchAPISearchResult } from '../../modules/twitch/requests/getTwitchSearch';
import * as getKickChannels from '../../modules/kick/requests/getKickChannels';
import * as getTwitchSearch from '../../modules/twitch/requests/getTwitchSearch';
import * as getYouTubeSearch from '../../modules/youtube/requests/getYouTubeSearch';
import { getSearchHandler } from './getSearchHandler';

describe('Search: getSearchHandler()', () => {
  const getKickChannelsMock  = jest.spyOn(getKickChannels,  'getKickChannels' );
  const getTwitchSearchMock  = jest.spyOn(getTwitchSearch,  'getTwitchSearch' );
  const getYouTubeSearchMock = jest.spyOn(getYouTubeSearch, 'getYouTubeSearch');

  beforeAll(() => {
    getKickChannelsMock.mockResolvedValue(kickChannels);
    getTwitchSearchMock.mockResolvedValue(twitchAPISearchResults);
    getYouTubeSearchMock.mockResolvedValue(youTubeAPISearchResults);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get search results from Kick', async () => {
    req.params = { service: 'kick' };
    await getSearchHandler(req, res, nextSpy);

    expect(getKickChannelsMock).toHaveBeenCalledWith({ slugs: ['foobar'] });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: '123', name: 'kick-1', imageURL: 'http://example.com/image1.jpg' },
      { id: '456', name: 'kick-2', imageURL: 'http://example.com/image2.jpg' },
    ]);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should get search results from Twitch', async () => {
    req.params = { service: 'twitch' };
    await getSearchHandler(req, res, nextSpy);

    expect(getTwitchSearchMock).toHaveBeenCalledWith('foobar');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 'twitch-1', name: 'Twitch 1', imageURL: 'http://example.com/image1.jpg' },
      { id: 'twitch-2', name: 'Twitch 2', imageURL: 'http://example.com/image2.jpg' },
    ]);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should get search results from YouTube', async () => {
    req.params = { service: 'youtube' };
    await getSearchHandler(req, res, nextSpy);

    expect(getYouTubeSearchMock).toHaveBeenCalledWith('foobar');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 'youtube-1', name: 'Channel 1', imageURL: 'http://example.com/image1.jpg' },
      { id: 'youtube-2', name: 'Channel 2', imageURL: 'http://example.com/image2.jpg' },
    ]);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should return a 400 if no query is provided', async () => {
    const badReq = { params: { service: 'foobar' }, query: {} } as unknown as Request;
    await getSearchHandler(badReq, res, nextSpy);

    expect(getYouTubeSearchMock).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    getYouTubeSearchMock.mockRejectedValueOnce(new Error('foobar'));

    await getSearchHandler(req, res, nextSpy);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });
});

const kickChannels = [
  { broadcaster_user_id: 123, slug: 'kick-1', banner_picture: 'http://example.com/image1.jpg' },
  { broadcaster_user_id: 456, slug: 'kick-2', banner_picture: 'http://example.com/image2.jpg' },
] as unknown as KickAPIChannel[];

const twitchAPISearchResults = [
  { id: 'twitch-1', display_name: 'Twitch 1', thumbnail_url: 'http://example.com/image1.jpg' },
  { id: 'twitch-2', display_name: 'Twitch 2', thumbnail_url: 'http://example.com/image2.jpg' },
] as unknown as TwitchAPISearchResult[];

const youTubeAPISearchResults = [
  { id: { channelId: 'youtube-1' }, snippet: { title: 'Channel 1', thumbnails: { medium: { url: 'http://example.com/image1.jpg' } } } },
  { id: { channelId: 'youtube-2' }, snippet: { title: 'Channel 2', thumbnails: { medium: { url: 'http://example.com/image2.jpg' } } } },
] as unknown as YouTubeAPISearchResult[];

const req = { query: { query: 'foobar' } } as unknown as Request;
const res = { status: jest.fn(() => res), json: jest.fn(), sendStatus: jest.fn() } as unknown as Response;
const nextSpy = jest.fn();