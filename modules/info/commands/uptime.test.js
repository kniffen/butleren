import * as command from './uptime.js'

describe('modules.info.commands.uptime', function() {
  const interaction = { reply: jest.fn()};
  const uptimeSpy = jest.spyOn(process, 'uptime')

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should contain certain properties', function() {
    expect(command).toEqual(expect.objectContaining({
      data: expect.objectContaining({
        name: 'uptime',
        description: 'Uptime check',
        options: [],
      }),
      isLocked: true,
      execute: expect.anything()
    }));
  });

  it('should reply with "uptime!"', async function() {
    uptimeSpy.mockReturnValueOnce(30);
    await command.execute(interaction);
    expect(interaction.reply).toHaveBeenLastCalledWith('Uptime: 00:00:30');

    uptimeSpy.mockReturnValue(90);
    await command.execute(interaction);
    expect(interaction.reply).toHaveBeenLastCalledWith('Uptime: 00:01:30');

    uptimeSpy.mockReturnValue(5_575);
    await command.execute(interaction);
    expect(interaction.reply).toHaveBeenLastCalledWith('Uptime: 01:32:55');

    uptimeSpy.mockReturnValue(200_345);
    await command.execute(interaction);
    expect(interaction.reply).toHaveBeenLastCalledWith('Uptime: 2 days 07:39:05');
  })
})