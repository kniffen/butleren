import express from 'express'
import bodyParser from 'body-parser'
import supertest from 'supertest'

import database from '../../../database/index.js'
import { router as kickRouter } from './index.js'
import * as getKickChannels from '../utils/getKickChannels.js'

describe('/api/kick/:guild/channels', function() {
  const getKickChannelsSpy = jest.spyOn(getKickChannels, 'getKickChannels');

  const URI = '/kick/guild001/channels';
  let app = null;
  let db  = null;

  async function resetKickChannelsInDatabase() {
    await db.run('DELETE FROM kickChannels');

    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId) VALUES (?,?,?)',
      ['guild001', '111111', 'channel001']
    );
    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId) VALUES (?,?,?)',
      ['guild001', '222222', 'channel002']
    );
    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId) VALUES (?,?,?)',
      ['guild002', '111111', 'channel003']
    );
    await db.run(
      'INSERT INTO kickChannels (guildId, broadcasterUserId, notificationChannelId) VALUES (?,?,?)',
      ['guild002', '333333', 'channel004']
    );
  }

  const defaultDatabaseEntries = [
    {broadcasterUserId: '111111', guildId: 'guild001', notificationChannelId: 'channel001', notificationRoleId: null},
    {broadcasterUserId: '222222', guildId: 'guild001', notificationChannelId: 'channel002', notificationRoleId: null},
    {broadcasterUserId: '111111', guildId: 'guild002', notificationChannelId: 'channel003', notificationRoleId: null},
    {broadcasterUserId: '333333', guildId: 'guild002', notificationChannelId: 'channel004', notificationRoleId: null},
  ];

  beforeAll(async function() {
    app = express();
    db = await database;

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use('/kick', kickRouter);

    await db.migrate();
  })

  beforeEach(async function() {
    await resetKickChannelsInDatabase();

    jest.clearAllMocks();
  });

  afterAll(function() {
    jest.restoreAllMocks();
  });

  describe('GET', function() {
    it('Should respond with an array of entries for the guild', async function() {
      getKickChannelsSpy.mockImplementationOnce(async ({ broadcasterUserIds }) => broadcasterUserIds.map(broadcasterUserId => ({
        broadcaster_user_id: broadcasterUserId,
        slug:                `${broadcasterUserId}_slug`,
        channel_description: `${broadcasterUserId}_description`,
      })));

      const res = await supertest(app).get(URI);

      expect(console.error).not.toHaveBeenCalled();
      expect(getKickChannelsSpy).toHaveBeenCalledWith({broadcasterUserIds: ['111111', '222222']});
      expect(res.body).toHaveLength(2);
      expect(res.body.at(0)).toEqual({
        broadcasterUserId:     '111111',
        name:                  '111111_slug',
        description:           '111111_description',
        url:                   'https://www.kick.com/111111_slug',
        notificationChannelId: 'channel001',
        notificationRoleId:    null,
      });
      expect(res.body.at(1)).toEqual({
        broadcasterUserId:     '222222',
        name:                  '222222_slug',
        description:           '222222_description',
        url:                   'https://www.kick.com/222222_slug',
        notificationChannelId: 'channel002',
        notificationRoleId:    null,
      });
    });

    it('Should handle there being no Kick API results corresponding with the entries', async function() {
      getKickChannelsSpy.mockResolvedValueOnce([]);

      const res = await supertest(app).get(URI);

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(200);
      expect(res.body).toEqual([
        {
          broadcasterUserId:     '111111',
          name:                  '',
          description:           '',
          url:                   'https://www.kick.com/',
          notificationChannelId: 'channel001',
          notificationRoleId:    null,
        },
        {
          broadcasterUserId:    '222222',
          name:                  '',
          description:           '',
          url:                   'https://www.kick.com/',
          notificationChannelId: 'channel002',
          notificationRoleId:    null,
        }
      ]);
    });

    it('Should respond with a 500 status code if there was an issue reading from the database', async function() {
      jest.spyOn(db, 'all').mockRejectedValue('Database error');

      const res = await supertest(app).get(URI);

      expect(console.error).toHaveBeenCalledWith('GET', '/kick/guild001/channels', 'Database error');
      expect(res.status).toEqual(500);

      db.all.mockRestore();
    })
  })

  describe('POST', function() {
    const body = {
      broadcasterUserId:     '999999',
      notificationChannelId: 'channel999',
      notificationRoleId:    'role999',
    }

    it('Should add an entry to the database', async function() {
      const res = await supertest(app).post(URI).send(body);

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(201);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual([
        ...defaultDatabaseEntries,
        {broadcasterUserId: '999999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ]);
    });

    it('Should respond with a 500 status code if there was an issue adding the entry to the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error');

      const res = await supertest(app).post(URI).send(body);

      expect(console.error).toHaveBeenCalledWith('POST', URI, 'Database error');
      expect(res.status).toEqual(500);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual(defaultDatabaseEntries);

      db.run.mockRestore();
    })

    it('Should respond with a 409 status code if entry already exists', async function() {
      await supertest(app).post(URI).send(body);
      const res = await supertest(app).post(URI).send(body);

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(409);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual([
        ...defaultDatabaseEntries,
        {broadcasterUserId: '999999', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
      ]);
    });

    it('Should respond with a 400 status code if there were missing body properties', async function() {
      const res = await supertest(app).post(URI).send({});

      expect(res.status).toEqual(400);
    });
  });

  describe('PATCH', function() {
    const body = {
      broadcasterUserId:     '111111',
      notificationChannelId: 'channel999',
      notificationRoleId:    'role999'
    }

    it('Should update an entry in the database', async function() {
      const res = await supertest(app).patch(URI).send(body);

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(200);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual([
        {broadcasterUserId: '111111', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ]);
    });

    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error');

      const res = await supertest(app).patch(URI).send(body);

      expect(console.error).toHaveBeenCalledWith('PATCH', URI, 'Database error');
      expect(res.status).toEqual(500);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual(defaultDatabaseEntries);

      db.run.mockRestore();
    });

    it('should ignore unsupported properties', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        foo: 'bar'
      });

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(200);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual([
        {broadcasterUserId: '111111', guildId: 'guild001', notificationChannelId: 'channel999', notificationRoleId: 'role999'},
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ]);
    });

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      const res = await supertest(app).patch(URI).send({
        ...body,
        broadcasterUserId: '999999'
      });

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(404);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual(defaultDatabaseEntries);
    })
  })

  describe('DELETE', function() {
    const body = {
      id: '111111'
    }

    it('Should delete an entry from the database', async function() {
      const res = await supertest(app).delete(URI).send(body);

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(200);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ]);
    });

    it('Should respond with a 500 status code if there was an issue updating the database', async function() {
      jest.spyOn(db, 'run').mockRejectedValue('Database error');

      const res = await supertest(app).delete(URI).send(body);

      expect(console.error).toHaveBeenCalledWith('DELETE', URI, 'Database error');
      expect(res.status).toEqual(500);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual(defaultDatabaseEntries);

      db.run.mockRestore();
    });

    it('Should respond with a 404 status code if the entry does not exist in the database', async function() {
      await supertest(app).delete(URI).send(body);
      const res = await supertest(app).delete(URI).send(body);

      expect(console.error).not.toHaveBeenCalled();
      expect(res.status).toEqual(404);
      expect(await db.all('SELECT * FROM kickChannels')).toEqual([
        defaultDatabaseEntries[1],
        defaultDatabaseEntries[2],
        defaultDatabaseEntries[3],
      ]);
    });
  });
});