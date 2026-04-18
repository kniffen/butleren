import { useCallback, useContext, useState, type JSX } from 'react';
import { schemas } from '@repo/api-specification';
import { useAPI } from '../../../provider/hooks/useAPI';
import { KickChannelsModalContext } from '../KickChannelsModal/KickChannelsModal';
import './KickChannelForm.scss';

export function KickChannelForm(): JSX.Element {
  const { guild, kick } = useAPI();
  const { notificationConfig, setKickChannel, setNotificationConfig } = useContext(KickChannelsModalContext)!;
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
    const newNotificationConfig = schemas.KickNotificationConfig.safeParse({
      broadcasterUserId:     Number(formData.get('broadcaster')),
      notificationChannelId: formData.get('notification-channel')?.toString(),
      notificationRoleId:    formData.get('notification-role')?.toString(),
    });

    if (!newNotificationConfig.success) {
      setIsSaving(false);
      return;
    }

    await kick.postChannel(newNotificationConfig.data);
    await kick.updateChannels();
    setKickChannel(null);
    setNotificationConfig(null);
    setIsSaving(false);
  }, [isSaving, kick, setKickChannel, setNotificationConfig]);

  const onCancel = useCallback(() => {
    if (isSaving) {
      return;
    }

    setKickChannel(null);
    setNotificationConfig(null);
  }, [isSaving, setKickChannel, setNotificationConfig]);

  return <form className="kick-channel-form" onSubmit={onSubmitHandler}>
    <div className="kick-channel-form__items">
      <input name="broadcaster" type="text" value={notificationConfig?.broadcasterUserId} readOnly hidden required/>

      <div className="kick-channel-form__item">
        <label>Notification channel</label>
        <select name="notification-channel" defaultValue={notificationConfig?.notificationChannelId} required>
          {guild.data?.channels
            ?.filter((channel) => 'TEXT' === channel.type || 'ANNOUNCEMENT' === channel.type)
             .map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)
          }
        </select>
      </div>

      <div className="kick-channel-form__item">
        <label>Notification role</label>
        <select name="notification-role" defaultValue={notificationConfig?.notificationRoleId ?? ''}>
          <option value="">None</option>
          {guild.data?.roles?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select>
      </div>
    </div>

    <div className="kick-channel-form__buttons">
      <button className={`kick-channel-form__button${isSaving ? ' kick-channel-form__button--loading' : ''}`} type="submit">Save</button>
      <button className={`kick-channel-form__button${isSaving ? ' kick-channel-form__button--loading' : ''}`} onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

