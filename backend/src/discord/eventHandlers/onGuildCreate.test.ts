import type { Guild } from "discord.js";
import { onGuildCreate } from "./onGuildCreate";
import * as updateGuildCommands from "../utils/updateGuildCommands";

describe('Discord: onGuildCreate', () => {
  const updateGuildCommandsSpy = jest.spyOn(updateGuildCommands, 'updateGuildCommands').mockImplementation();

  afterAll(() => {
    updateGuildCommandsSpy.mockRestore();
  });

  test('It should update guild commands', async () => {
    await onGuildCreate(guild);
    expect(console.log).toHaveBeenCalledWith('Discord: Connected to new guild guild "foobar"');
    expect(updateGuildCommandsSpy).toHaveBeenCalledWith(guild);
  });

  test('It should catch errors and log them', async () => {
    const error = new Error('Test error');
    updateGuildCommandsSpy.mockRejectedValueOnce(error);

    await onGuildCreate(guild);
    expect(console.error).toHaveBeenCalledWith("Discord: Error during onGuildCreate event", error);
  });
});

const guild = { name: 'foobar' } as Guild;
