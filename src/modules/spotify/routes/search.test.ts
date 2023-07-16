import supertest from 'supertest';
import express from 'express';

import spotifyRouter from './index';
import { fetchSpotifySearch } from '../utils';
import { SpotifySearchResult } from '../types';

import './search';

jest.mock(
  '../utils/fetchSpotifySearch',
  () => ({ __esModule: true, fetchSpotifySearch: jest.fn() })
);

describe('/api/spotify/search', function () {
  let app: ReturnType<typeof express>;
  const fetchSpotifySearchMock = fetchSpotifySearch as jest.MockedFunction<typeof fetchSpotifySearch>;

  beforeAll(function () {
    app = express();
    app.use('/api/spotify', spotifyRouter);
  });

  describe('GET', function () {
    const URI = '/api/spotify/search?q=query001&type=type001&market=market001&limit=100';

    it('Should respond with an array of search results', async function () {
      fetchSpotifySearchMock.mockResolvedValue({foo: 'bar'} as unknown as SpotifySearchResult);

      const res = await supertest(app).get(URI);

      expect(fetchSpotifySearchMock).toHaveBeenCalledWith('query001', 'type001', 'market001', 100);
      expect(res.body).toEqual({foo: 'bar'});
    });

    it('Should handle there being no search results', async function () {
      fetchSpotifySearchMock.mockResolvedValue({} as unknown as SpotifySearchResult);

      const res = await supertest(app).get(URI);

      expect(res.body).toEqual({});
    });

    it.todo('Should respond with a 400 status code of there\'s a missing type query');

    it.todo('Should respond with a 500 status code if there was an error thrown while fetching');
  });
});