import { createContext, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Modal } from '../../Modal/Modal';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { TwitchChannel, TwitchNotificationConfig } from '../../../types';
import { SearchForm } from '../../SearchForm/SearchForm';
import { TwitchChannelForm } from '../TwitchChannelForm/TwitchChannelForm';
import { TwitchChannels } from '../TwitchChannels/TwitchChannels';
import './TwitchChannelsModal.scss';

export interface TwitchProviderState {
  twitchChannel: TwitchChannel | null;
  setTwitchChannel: (channel: TwitchChannel | null) => void;
  notificationConfig: TwitchNotificationConfig | null;
  setNotificationConfig: (config: TwitchNotificationConfig | null) => void;
}

export const TwitchChannelsModalContext = createContext<TwitchProviderState | null>(null);

export function TwitchChannelsModal(): JSX.Element {
  const { twitch } = useAPI();
  const [twitchChannel, setTwitchChannel] = useState<TwitchChannel| null>(null);
  const [notificationConfig, setNotificationConfig] = useState<TwitchNotificationConfig | null>(null);
  const hasInitialized = useRef(false);

  const title = useMemo(() => {
    if (twitchChannel) {
      return 'Edit channel';
    }

    if (notificationConfig) {
      return 'Add channel';
    }

    return 'Twitch channels';
  }, [twitchChannel, notificationConfig]);

  useEffect(() => {
    if (!hasInitialized.current) {
      twitch.updateChannels();
      hasInitialized.current = true;
    }
  }, [twitch]);

    return (
      <TwitchChannelsModalContext.Provider value={{
        twitchChannel,
        setTwitchChannel,
        notificationConfig,
        setNotificationConfig,
      }}>
        <Modal title={title} buttonText="Manage channels" onClose={() => {setTwitchChannel(null); setNotificationConfig(null);}}>
          {notificationConfig
            ? <div className="twitch-channel-form-container">
                <SearchForm
                  initialQuery={twitchChannel?.name}
                  service="twitch"
                  onSelect={(result) => setNotificationConfig({
                    ...notificationConfig,
                    id: result.id,
                  })}
                />
                <hr />
                <TwitchChannelForm />
              </div>
            : <TwitchChannels />
          }
        </Modal>
      </TwitchChannelsModalContext.Provider>
    );
}
