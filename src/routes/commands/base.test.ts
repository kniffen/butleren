import express from 'express';
import supertest from 'supertest';
import { Collection } from 'discord.js';

import clientMock from '../../discord/client';

import commandsRouter from './';

jest.mock('../../discord/client', () => ({
  __esModule: true,
  default: {
    guilds: {
      fetch: jest.fn()
    }
  }
}));

jest.mock('../../modules/index', () => ({
  __esModule: true,
  modules: [
    {
      id: 'mod001',
      name: 'module001',
      commands: [
        {
          data: {name: 'command001', description: 'description001'},
          isLocked: false
        },
        {
          data: {name: 'command002', description: 'description002'},
          isLocked: false
        }
      ]
    },
    {
      id: 'mod002',
      name: 'module002',
      commands: [
        {
          data: {name: 'command003', description: 'description003'},
          isLocked: true
        }
      ]
    },
    {
      id: 'mod003',
      name: 'module003'
    }
  ]
}));

describe('/api/commands/:guild', function() {
  let app: ReturnType<typeof express>;
  const URI = '/api/commands/guild001';

  const guild = {
    commands: {
      fetch: jest.fn()
    }
  };

  const guildCommands = new Collection();
  guildCommands.set('cmd001', {name: 'command001'});
  guildCommands.set('cmd003', {name: 'command003'});

  beforeAll(function() {
    app = express();

    app.use('/api/commands', commandsRouter);
  });

  beforeEach(function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    clientMock.guilds.fetch.mockResolvedValue(guild);
    guild.commands.fetch.mockResolvedValue(guildCommands);
  });

  afterEach(function() {
    jest.clearAllMocks();
  });

  afterAll(function() {
    jest.restoreAllMocks();
  });

  describe('GET', function() {
    it('should respond with an array of commands', async function() {
      const res = await supertest(app).get(URI);

      expect(res.body).toEqual([
        {
          name: 'command001',
          description: 'description001',
          isEnabled: true,
          isLocked: false,
          module: {id: 'mod001', name: 'module001'}
        },
        {
          name: 'command002',
          description: 'description002',
          isEnabled: false,
          isLocked: false,
          module: {id: 'mod001', name: 'module001'}
        },
        {
          name: 'command003',
          description: 'description003',
          isEnabled: true,
          isLocked: true,
          module: {id: 'mod002', name: 'module002'}
        }
      ]);
    });

    it('should respond with a 404 status code if there was an issue fetching commands from the guild', async function() {
      guild.commands.fetch.mockRejectedValue('Error message');

      const res = await supertest(app).get(URI);

      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Error message');
      expect(res.status).toEqual(404);
    });

    it('should resport with a 404 status code if the guild does not exist', async function() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      clientMock.guilds.fetch.mockRejectedValue('Error message');

      const res = await supertest(app).get(URI);

      expect(console.error).toHaveBeenCalledWith('GET', URI, 'Error message');
      expect(res.status).toEqual(404);
    });

    it('should resport with a 500 status code if something went wrong fetching the commands', async function() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      clientMock.guilds.fetch.mockResolvedValue('foobar');

      const res = await supertest(app).get(URI);

      expect(console.error).toHaveBeenCalledWith('GET', URI, expect.anything());
      expect(res.status).toEqual(500);
    });
  });
});
