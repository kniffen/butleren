import { ClientApplication, Collection } from 'discord.js';
import { updateApplicationCommands } from './updateApplicationCommands';

jest.mock('../../modules/modules', () => ({
  commands: new Map([
    ['foo', { isLocked: true,  slashCommandBuilder: { name: 'foo' } }],
    ['bar', { isLocked: false, slashCommandBuilder: { name: 'bar' } }],
    ['baz', { isLocked: true,  slashCommandBuilder: { name: 'baz' } }],
  ]),
}));

describe('Discord: updateApplicationCommands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should create new locked commands', async () => {
    await updateApplicationCommands(application);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({ name: 'foo' });
  });

  test('It should update existing locked commands', async () => {
    await updateApplicationCommands(application);

    expect(editSpy).toHaveBeenCalledTimes(1);
    expect(editSpy).toHaveBeenCalledWith(existingCommands.get('baz'), { name: 'baz' });
  });

  test('It should delete commands that are no longer in the bot', async () => {
    await updateApplicationCommands(application);

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(existingCommands.get('qux'));
  });

  test('It should do nothing if the application is null', async () => {
    await updateApplicationCommands(null);

    expect(createSpy).not.toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});

const existingCommands = new Collection([
  ['baz', { name: 'baz' }],
  ['qux', { name: 'qux' }],
]);

const createSpy = jest.fn();
const editSpy   = jest.fn();
const deleteSpy = jest.fn();
const application = {
  commands: {
    fetch:  async () => existingCommands,
    create: createSpy,
    edit:   editSpy,
    delete: deleteSpy,
  }
} as unknown as ClientApplication;