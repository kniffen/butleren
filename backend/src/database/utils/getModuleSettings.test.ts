import type { Guild } from "discord.js";
import { database } from "../database";
import type { ModuleSettings } from "../types";
import { getModuleSettings } from "./getModuleSettings";

describe('getModuleSettings()', () => {
  beforeEach(async () => {
    const db = await database;
    await db.run(
      'INSERT OR REPLACE INTO modules (slug, guildId, settings) VALUES (?,?,?)',
      slug,
      guild.id,
      JSON.stringify(moduleSettings),
    );
  })

  test('should return the module settings', async () => {
    const settings = await getModuleSettings(slug, guild);
    expect(settings).toEqual(moduleSettings);
  });

  test('should return null if the module settings do not exist', async () => {
    const settings = await getModuleSettings('nonExistentModule', guild);
    expect(settings).toBeNull();
  });
});

const slug = 'testModule';
const guild = {id: '123'} as Guild;
const moduleSettings: ModuleSettings = {
  isEnabled: true,
}