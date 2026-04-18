import { useCallback, useContext, useState, type JSX } from 'react';
import { schemas } from '@repo/api-specification';
import { useAPI } from '../../../provider/hooks/useAPI';
import { YouTubeChannelsModalContext } from '../YouTubeChannelsModal/YouTubeChannelsModal';
import { Toggle } from '../../Toggle/Toggle';
import './YouTubeChannelForm.scss';

export function YouTubeChannelForm(): JSX.Element {
  const { guild, youtube } = useAPI();
  const { notificationConfig, setYouTubeChannel, setNotificationConfig } = useContext(YouTubeChannelsModalContext)!;
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
    const newNotificationConfig = schemas.YouTubeNotificationConfig.safeParse({
      channelId:              formData.get('channel'),
      includeLiveStreams:     'on' === formData.get('include-live'),
      notificationChannelId:  formData.get('notification-channel'),
      notificationRoleId:     formData.get('notification-role'),
      liveNotificationRoleId: formData.get('live-notification-role'),
    });

    if (!newNotificationConfig.success) {
      setIsSaving(false);
      return;
    }

    await youtube.postChannel(newNotificationConfig.data);
    await youtube.updateChannels();
    setYouTubeChannel(null);
    setNotificationConfig(null);
    setIsSaving(false);
  }, [isSaving, youtube, setYouTubeChannel, setNotificationConfig]);

  const onCancel = useCallback(() => {
    if (isSaving) {
      return;
    }

    setYouTubeChannel(null);
    setNotificationConfig(null);
  }, [isSaving, setYouTubeChannel, setNotificationConfig]);

  return <form className="youtube-channel-form" onSubmit={onSubmitHandler}>
    <div className="youtube-channel-form__items">
      <input name="channel" type="text" value={notificationConfig?.channelId} readOnly hidden required/>

      <div className="youtube-channel-form__item">
        <label>Notification channel</label>
        <select name="notification-channel" defaultValue={notificationConfig?.notificationChannelId} required>
          {guild.data?.channels
            ?.filter((channel) => 'TEXT' === channel.type || 'ANNOUNCEMENT' === channel.type)
             .map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)
          }
        </select>
      </div>

      <div className="youtube-channel-form__item">
        <label>Notification role</label>
        <select name="notification-role" defaultValue={notificationConfig?.notificationRoleId ?? ''}>
          <option value="">None</option>
          {guild.data?.roles?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select>
      </div>

      <div className="youtube-channel-form__item">
        <label>Include live streams</label>
        <Toggle defaultChecked={!!notificationConfig?.includeLiveStreams} name='include-live' />
      </div>

      <div className="youtube-channel-form__item">
        <label>Live stream notification role</label>
        <select name="live-notification-role" defaultValue={notificationConfig?.liveNotificationRoleId ?? ''}>
          <option value="">None</option>
          {guild.data?.roles?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select>
      </div>
    </div>

    <div className="youtube-channel-form__buttons">
      <button className={`youtube-channel-form__button${isSaving ? ' youtube-channel-form__button--loading' : ''}`} type="submit">Save</button>
      <button className={`youtube-channel-form__button${isSaving ? ' youtube-channel-form__button--loading' : ''}`} onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

