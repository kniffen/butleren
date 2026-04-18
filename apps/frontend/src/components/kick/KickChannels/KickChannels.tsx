import { useContext, useMemo, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { KickChannel, KickNotificationConfig } from '../../../types';
import './KickChannels.scss';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { KickChannelsModalContext } from '../KickChannelsModal/KickChannelsModal';

interface KickChannelTableItem {
  name: string;
  channel: string;
  role: string;
  kickChannel: KickChannel;
  notificationConfig: KickNotificationConfig;
}

export function KickChannels(): JSX.Element {
  const { kick, guild } = useAPI();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setNotificationConfig, setKickChannel } = useContext(KickChannelsModalContext)!;

  const tableItems = useMemo<KickChannelTableItem[]>(() => {
    return kick.channels.map((channel) => {
      const discordChannel = guild.data?.channels?.find((c) => c.id === channel.notificationConfig.notificationChannelId);
      const discordRole = guild.data?.roles?.find((r) => r.id === channel.notificationConfig.notificationRoleId);

      return {
        name:               channel.name,
        channel:            discordChannel?.name || 'N/A',
        role:               discordRole?.name || '',
        kickChannel:        channel,
        notificationConfig: channel.notificationConfig,
      };
    });
  }, [kick.channels, guild.data]);

  const onEditHandler = (item: KickChannelTableItem): void => {
    if (!isDeleting) {
      setNotificationConfig(item.notificationConfig);
      setKickChannel(item.kickChannel);
    }
  };

  const onDeleteHandler = async (broadcasterUserId: number): Promise<void> => {
    if (!isDeleting) {
      setIsDeleting(true);
      await kick.deleteChannel(broadcasterUserId);
      await kick.updateChannels();
      setIsDeleting(false);
    }
  };

  if (kick.isLoading) {
    return <div className="kick-channels-loading-container">
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
    </div>;
  }

  return <div className="kick-channels-container">
    <div className="kick-channels">
      <div className="kick-channels__row kick-channels-header">
        <span>Broadcaster</span>
        <span>Notification channel</span>
        <span>Notification role</span>
        <span>Actions</span>
      </div>

      {tableItems.map((item) => (
        <div className="kick-channels__row kick-channel" key={item.kickChannel.broadcasterUserId}>
          <span>{item.name}</span>
          <span>{item.channel}</span>
          <span>{item.role}</span>
          <span className="kick-channel__actions">
            <span className="material-symbols-outlined" onClick={() => { onEditHandler(item);}}>edit_square</span>
            <span className="material-symbols-outlined delete" onClick={() => { onDeleteHandler(item.kickChannel.broadcasterUserId);}}>delete</span>
          </span>
        </div>)
      )}
    </div>

    <AddKickChannelButton />
  </div>;
}

const AddKickChannelButton = (): JSX.Element => {
  const { setNotificationConfig } = useContext(KickChannelsModalContext)!;

  const onClickHandler = (): void => {
    setNotificationConfig({
      broadcasterUserId:     0,
      notificationChannelId: '',
      notificationRoleId:    '',
    });
  };

  return <div className="add-kick-channel-button-wrapper">
    <button className="add-kick-channel-button" onClick={onClickHandler}>Add channel</button>
  </div>;
};