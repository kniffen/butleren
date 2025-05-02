import express from 'express'
import supertest from 'supertest'
import { router as kickRouter } from './index.js'
import * as getKickChannels from '../utils/getKickChannels.js'

describe('/api/kick/search', function() {
  const getKickChannelsSpy = jest.spyOn(getKickChannels, 'getKickChannels');

  const URI = '/api/kick/search?q=query001';
  let app = null;

  beforeAll(function() {
    app = express();
    app.use('/api/kick', kickRouter);
  });

  describe('GET', function() {
    it('Should respond with an array of search results', async function() {
      getKickChannelsSpy.mockResolvedValue(['foo', 'bar']);

      const res = await supertest(app).get(URI);

      expect(getKickChannelsSpy).toHaveBeenCalledWith({slugs: ['query001']});
      expect(res.body).toEqual(['foo', 'bar']);
    });

    it('Should handle there being no search results', async function() {
      getKickChannelsSpy.mockResolvedValue([]);

      const res = await supertest(app).get(URI);

      expect(res.body).toEqual([]);
    });
  });
});