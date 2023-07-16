import { CacheType, ChatInputCommandInteraction, CommandInteractionOption } from 'discord.js';
import database from '../../../../database';
import subCommandExecutor from './setlocation';

describe('modules.users.commands.profile.setlocation', function() {
  let db: Awaited<typeof database>;
  let interaction: ChatInputCommandInteraction;
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation();

  beforeAll(async function() {
    db = await database;

    await db.migrate();
  });

  beforeEach(async function() {
    jest.clearAllMocks();

    fetchMock.mockResolvedValue({ok: true} as Response);

    interaction = {
      user: {
        id: 'user001'
      },
      options: {
        get: () => ({value: 'location001'})
      },
      reply: jest.fn()
    } as unknown as ChatInputCommandInteraction;
  });

  afterAll(function() {
    jest.restoreAllMocks();
  });

  it('should set a user\'s location', async function() {
    await subCommandExecutor(interaction);

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location001'}
    ]);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Your location is now set to `location001`\nType `/profile` to view your updated profile.',
      ephemeral: true
    });
  });

  it('should update a user\'s location', async function() {
    interaction.options.get = () => ({value: 'location002'} as CommandInteractionOption<CacheType>);

    await subCommandExecutor(interaction);

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ]);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Your location is now set to `location002`\nType `/profile` to view your updated profile.',
      ephemeral: true
    });
  });

  it('should not set the location if it cannot be verified', async function() {
    fetchMock.mockResolvedValue({ok: false} as Response);

    await subCommandExecutor(interaction);

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ]);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to verify that location.',
      ephemeral: true
    });
  });

  it('should handle reading from the database being rejected', async function() {
    const dbGetMock = jest.spyOn(db, 'get').mockRejectedValue('Error message');
    interaction.options.get = () => ({value: 'location999'} as CommandInteractionOption<CacheType>);

    await subCommandExecutor(interaction);

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ]);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to set your location.',
      ephemeral: true
    });

    dbGetMock.mockRestore();
  });

  it('should handle writing to the database being rejected', async function() {
    jest.spyOn(db, 'run').mockRejectedValue('Error message');
    interaction.options.get = () => ({value: 'location999'} as CommandInteractionOption<CacheType>);

    await subCommandExecutor(interaction);

    expect(await db.all('SELECT * FROM users')).toEqual([
      {id: 'user001', location: 'location002'}
    ]);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to set your location.',
      ephemeral: true
    });
  });
});
