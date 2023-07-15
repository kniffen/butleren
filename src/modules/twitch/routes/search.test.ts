import express from 'express';
import supertest from 'supertest';

import fetchTwitchSearch from '../utils/fetchTwitchSearch';
import twitchRouter from './';

jest.mock(
  '../utils/fetchTwitchSearch',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('/api/twitch/search', function () {
  const fetchTwitchSearchMock = fetchTwitchSearch as jest.MockedFunction<typeof fetchTwitchSearch>;

  // const URI = '/api/twitch/search?q=query001&type=foobar';
  let app: ReturnType<typeof express>;

  beforeAll(function () {
    app = express();

    app.use('/api/twitch', twitchRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    fetchTwitchSearchMock.mockResolvedValue({foo: 'bar'});
  });

  describe('GET', function () {
    it('Should fetch channels searches', async () => {
      const res = await supertest(app).get('/api/twitch/search?q=query&type=channels');

      expect(fetchTwitchSearchMock).toHaveBeenCalledWith({ query: 'query', type: 'channels' });
      expect(res.body).toEqual({foo: 'bar'});
    });

    it('Should fetch categories searches', async () => {
      const res = await supertest(app).get('/api/twitch/search?q=query&type=categories');

      expect(fetchTwitchSearchMock).toHaveBeenCalledWith({ query: 'query', type: 'categories' });
      expect(res.body).toEqual({foo: 'bar'});
    });

    it('Should handle there being no type query', async () => {
      const res = await supertest(app).get('/api/twitch/search?q=query');

      expect(fetchTwitchSearchMock).toHaveBeenCalledWith({ query: 'query' });
      expect(res.body).toEqual({foo: 'bar'});
    });


    it('Should respond with a 400 status code if the type is not a valid search type', async () => {
      const res = await supertest(app).get('/api/twitch/search?q=query&type=invalid-type');

      expect(fetchTwitchSearchMock).not.toHaveBeenCalled();
      expect(res.status).toEqual(400);
    });

    it('Should respond with a 500 status code if something went wrong while attempting to fetch the search', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const err = new Error('Fetch error');
      fetchTwitchSearchMock.mockRejectedValue(err);

      const res = await supertest(app).get('/api/twitch/search?q=query&type=channels');

      expect(fetchTwitchSearchMock).toHaveBeenCalledWith({ query: 'query', type: 'channels' });
      expect(consoleErrorSpy).toHaveBeenCalledWith(err);
      expect(res.status).toEqual(500);

      consoleErrorSpy.mockRestore();
    });
  });
});