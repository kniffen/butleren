import { useContext, useMemo, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { YouTubeChannel, YouTubeNotificationConfig } from '../../../types';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { YouTubeChannelsModalContext } from '../YouTubeChannelsModal/YouTubeChannelsModal';
import './YouTubeChannels.scss';

interface YouTubeChannelTableItem {
  name: string;
  channel: string;
  role: string;
  liveRole: string;
  youtubeChannel: YouTubeChannel;
  notificationConfig: YouTubeNotificationConfig;
}

export function YouTubeChannels(): JSX.Element {
  const { youtube, guild } = useAPI();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setNotificationConfig, setYouTubeChannel } = useContext(YouTubeChannelsModalContext)!;

  const tableItems = useMemo<YouTubeChannelTableItem[]>(() => {
    return youtube.channels.map((channel) => {
      const discordChannel  = guild.data?.channels?.find((c) => c.id === channel.notificationConfig.notificationChannelId);
      const discordRole     = guild.data?.roles?.find((r) => r.id === channel.notificationConfig.notificationRoleId);
      const liveDiscordRole = guild.data?.roles?.find((r) => r.id === channel.notificationConfig.liveNotificationRoleId);

      return {
        name:               channel.name,
        channel:            discordChannel?.name || 'N/A',
        role:               discordRole?.name    || '',
        liveRole:           liveDiscordRole?.name || '',
        youtubeChannel:     channel,
        notificationConfig: channel.notificationConfig,
      };
    });
  }, [youtube.channels, guild.data]);

  const onEditHandler = (item: YouTubeChannelTableItem): void => {
    if (!isDeleting) {
      setNotificationConfig(item.notificationConfig);
      setYouTubeChannel(item.youtubeChannel);
    }
  };

  const onDeleteHandler = async (id: string): Promise<void> => {
    if (!isDeleting) {
      setIsDeleting(true);
      await youtube.deleteChannel(id);
      await youtube.updateChannels();
      setIsDeleting(false);
    }
  };

  if (youtube.isLoading) {
    return <div className="youtube-channels-loading-container">
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
      <LoadingCard height='2rem'/>
    </div>;
  }

  return <div className="youtube-channels-container">
    <div className="youtube-channels">
      <div className="youtube-channels__row youtube-channels-header">
        <span>Channel</span>
        <span>Live</span>
        <span>Notification channel</span>
        <span>Notification role</span>
        <span>Live notification role</span>
        <span>Actions</span>
      </div>

      {tableItems.map((item) => (
        <div className="youtube-channels__row youtube-channel" key={item.youtubeChannel.channelId}>
          <span>{item.name}</span>
          <span>{item.notificationConfig.includeLiveStreams ? 'Yes' : 'No'}</span>
          <span>{item.channel}</span>
          <span>{item.role}</span>
          <span>{item.liveRole}</span>
          <span className="youtube-channel__actions">
            <span className="material-symbols-outlined" onClick={() => { onEditHandler(item);}}>edit_square</span>
            <span className="material-symbols-outlined delete" onClick={() => { onDeleteHandler(item.youtubeChannel.channelId);}}>delete</span>
          </span>
        </div>)
      )}
    </div>

    <AddYouTubeChannelButton />
  </div>;
}

const AddYouTubeChannelButton = (): JSX.Element => {
  const { setNotificationConfig } = useContext(YouTubeChannelsModalContext)!;

  const onClickHandler = (): void => {
    setNotificationConfig({
      channelId:              '',
      includeLiveStreams:     false,
      notificationChannelId:  '',
      notificationRoleId:     null,
      liveNotificationRoleId: null,
    });
  };

  return <div className="add-youtube-channel-button-wrapper">
    <button className="add-youtube-channel-button" onClick={onClickHandler}>Add channel</button>
  </div>;
};