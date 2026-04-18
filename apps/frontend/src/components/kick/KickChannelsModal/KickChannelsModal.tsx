import { createContext, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Modal } from '../../Modal/Modal';
import { useAPI } from '../../../provider/hooks/useAPI';
import type { KickChannel, KickNotificationConfig } from '../../../types';
import { KickChannelForm } from '../KickChannelForm/KickChannelForm';
import { KickChannels } from '../KickChannels/KickChannels';
import { SearchForm } from '../../SearchForm/SearchForm';
import './KickChannelsModal.scss';

export interface KickProviderState {
  kickChannel: KickChannel | null;
  setKickChannel: (channel: KickChannel | null) => void;
  notificationConfig: KickNotificationConfig | null;
  setNotificationConfig: (config: KickNotificationConfig | null) => void;
}

export const KickChannelsModalContext = createContext<KickProviderState | null>(null);

export function KickChannelsModal(): JSX.Element {
  const { kick } = useAPI();
  const [kickChannel, setKickChannel] = useState<KickChannel| null>(null);
  const [notificationConfig, setNotificationConfig] = useState<KickNotificationConfig | null>(null);
  const hasInitialized = useRef(false);

  const title = useMemo(() => {
    if (kickChannel) {
      return 'Edit channel';
    }

    if (notificationConfig) {
      return 'Add channel';
    }

    return 'Kick channels';
  }, [kickChannel, notificationConfig]);

  useEffect(() => {
    if (!hasInitialized.current) {
      kick.updateChannels();
      hasInitialized.current = true;
    }
  }, [kick]);

    return (
      <KickChannelsModalContext.Provider value={{
        kickChannel,
        setKickChannel,
        notificationConfig,
        setNotificationConfig,
      }}>
        <Modal title={title} buttonText="Manage channels" onClose={() => {setKickChannel(null); setNotificationConfig(null);}}>
          {notificationConfig
            ? <div className="kick-channel-form-container">
                <SearchForm
                  initialQuery={kickChannel?.name}
                  service='kick'
                  onSelect={(result) => setNotificationConfig({
                    ...notificationConfig,
                    broadcasterUserId: Number(result.id),
                  })}
                />
                <hr />
                <KickChannelForm />
              </div>
            : <KickChannels />
          }
        </Modal>
      </KickChannelsModalContext.Provider>
    );
}
