import { useCallback, type ReactNode } from 'react';
import { Card } from '../Card/Card';
import { useAPI } from '../../provider/hooks/useAPI';
import type { GuildSettings } from '../../types';
import'./GuildSettings.scss';

export function GuildSettings(): ReactNode {
  const { guilds, guild } = useAPI();

    const onSubmitHandler = useCallback(async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!guild) {
      return;
    }

    const form = e.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);
    const settings: GuildSettings = {
      color:    formData.get('color')?.toString()    || '#19D8B4',
      nickname: formData.get('nickname')?.toString() || null,
    };

    await guild.updateSettings(settings);
    await guilds.update();
  }, [guild, guilds]);

  const onReset = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const settings: GuildSettings = {
      color:    '#19D8B4',
      nickname: ''
    };
    await guild.updateSettings(settings);
    await guilds.update();
  }, [guild, guilds]);

  if (!guild.data) {
    return null;
  }

  return (
    <Card title="Settings">
      <form className="guild-settings-form" onSubmit={onSubmitHandler}>
        <div className="guild-settings-form__item">
          <label htmlFor="nickname">Nickname</label>
          <input type="text" id="nickname" name="nickname" defaultValue={guild.data.settings?.nickname || ''} />
        </div>
        <div className="guild-settings-form__item">
          <label htmlFor="color">Accent color</label>
          <input type="color" id="color" name="color" defaultValue={guild.data.settings?.color || '#000000'} />
        </div>
        <div className="guild-settings-form__item guild-settings-form__buttons">
          <button className="guild-settings-form__reset" onClick={onReset}>Reset</button>
          <button type="submit" className="guild-settings-form__submit">Save</button>
        </div>
      </form>
    </Card>
  );
}