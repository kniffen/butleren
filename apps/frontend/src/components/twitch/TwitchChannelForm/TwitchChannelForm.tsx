import { useCallback, useContext, useState, type JSX } from 'react';
import { schemas } from '@repo/api-specification';
import { useAPI } from '../../../provider/hooks/useAPI';
import { TwitchChannelsModalContext } from '../TwitchChannelsModal/TwitchChannelsModal';
import './TwitchChannelForm.scss';

export function TwitchChannelForm(): JSX.Element {
  const { guild, twitch } = useAPI();
  const { notificationConfig, setTwitchChannel, setNotificationConfig } = useContext(TwitchChannelsModalContext)!;
  const [isSaving, setIsSaving] = useState(false);

  const onSubmitHandler = useCallback(async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) {
      setIsSaving(false);
      return;
    }

    const formData = new FormData(form);
    const newNotificationConfig = schemas.TwitchNotificationConfig.safeParse({
      id:                    formData.get('broadcaster'),
      notificationChannelId: formData.get('notification-channel'),
      notificationRoleId:    formData.get('notification-role'),
    });

    if (!newNotificationConfig.success) {
      setIsSaving(false);
      return;
    }

    await twitch.postChannel(newNotificationConfig.data);
    await twitch.updateChannels();
    setTwitchChannel(null);
    setNotificationConfig(null);
    setIsSaving(false);
  }, [isSaving, twitch, setTwitchChannel, setNotificationConfig]);

  const onCancel = useCallback(() => {
    if (isSaving) {
      return;
    }

    setTwitchChannel(null);
    setNotificationConfig(null);
  }, [isSaving, setTwitchChannel, setNotificationConfig]);

  return <form className="twitch-channel-form" onSubmit={onSubmitHandler}>
    <div className="twitch-channel-form__items">
      <input name="broadcaster" type="text" value={notificationConfig?.id} readOnly hidden required/>

      <div className="twitch-channel-form__item">
        <label>Notification channel</label>
        <select name="notification-channel" defaultValue={notificationConfig?.notificationChannelId} required>
          {guild.data?.channels
            ?.filter((channel) => 'TEXT' === channel.type || 'ANNOUNCEMENT' === channel.type)
             .map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)
          }
        </select>
      </div>

      <div className="twitch-channel-form__item">
        <label>Notification role</label>
        <select name="notification-role" defaultValue={notificationConfig?.notificationRoleId ?? ''}>
          <option value="">None</option>
          {guild.data?.roles?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select>
      </div>
    </div>

    <div className="twitch-channel-form__buttons">
      <button className={`twitch-channel-form__button${isSaving ? ' twitch-channel-form__button--loading' : ''}`} type="submit">Save</button>
      <button className={`twitch-channel-form__button${isSaving ? ' twitch-channel-form__button--loading' : ''}`} onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

