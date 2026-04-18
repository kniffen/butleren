import { useContext, useMemo, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { TwitchChannel, TwitchNotificationConfig } from '../../../types';
import './TwitchChannels.scss';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { TwitchChannelsModalContext } from '../TwitchChannelsModal/TwitchChannelsModal';

interface TwitchChannelTableItem {
  name: string;
  channel: string;
  role: string;
  twitchChannel: TwitchChannel;
  notificationConfig: TwitchNotificationConfig;
}

export function TwitchChannels(): JSX.Element {
  const { twitch, guild } = useAPI();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setNotificationConfig, setTwitchChannel } = useContext(TwitchChannelsModalContext)!;

  const tableItems = useMemo<TwitchChannelTableItem[]>(() => {
    return twitch.channels.map((channel) => {
      const discordChannel = guild.data?.channels?.find((c) => c.id === channel.notificationConfig.notificationChannelId);
      const discordRole = guild.data?.roles?.find((r) => r.id === channel.notificationConfig.notificationRoleId);

      return {
        name:               channel.name,
        channel:            discordChannel?.name || 'N/A',
        role:               discordRole?.name || '',
        twitchChannel:      channel,
        notificationConfig: channel.notificationConfig,
      };
    });
  }, [twitch.channels, guild.data]);

  const onEditHandler = (item: TwitchChannelTableItem): void => {
    if (!isDeleting) {
      setNotificationConfig(item.notificationConfig);
      setTwitchChannel(item.twitchChannel);
    }
  };

  const onDeleteHandler = async (id: string): Promise<void> => {
    if (!isDeleting) {
      setIsDeleting(true);
      await twitch.deleteChannel(id);
      await twitch.updateChannels();
      setIsDeleting(false);
    }
  };

  if (twitch.isLoading) {
    return <div className="twitch-channels-loading-container">
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
    </div>;
  }

  return <div className="twitch-channels-container">
    <div className="twitch-channels">
      <div className="twitch-channels__row twitch-channels-header">
        <span>Broadcaster</span>
        <span>Notification channel</span>
        <span>Notification role</span>
        <span>Actions</span>
      </div>

      {tableItems.map((item) => (
        <div className="twitch-channels__row twitch-channel" key={item.twitchChannel.id}>
          <span>{item.name}</span>
          <span>{item.channel}</span>
          <span>{item.role}</span>
          <span className="twitch-channel__actions">
            <span className="material-symbols-outlined" onClick={() => { onEditHandler(item);}}>edit_square</span>
            <span className="material-symbols-outlined delete" onClick={() => { onDeleteHandler(item.twitchChannel.id);}}>delete</span>
          </span>
        </div>)
      )}
    </div>

    <AddTwitchChannelButton />
  </div>;
}

const AddTwitchChannelButton = (): JSX.Element => {
  const { setNotificationConfig } = useContext(TwitchChannelsModalContext)!;

  const onClickHandler = (): void => {
    setNotificationConfig({
      id:                    '',
      notificationChannelId: '',
      notificationRoleId:    '',
    });
  };

  return <div className="add-twitch-channel-button-wrapper">
    <button className="add-twitch-channel-button" onClick={onClickHandler}>Add channel</button>
  </div>;
};