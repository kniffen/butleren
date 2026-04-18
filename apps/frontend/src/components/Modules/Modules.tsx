import type { JSX, ReactNode } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { Card } from '../../components/Card/Card';
import { Toggle } from '../../components/Toggle/Toggle';
import { KickChannelsModal } from '../kick/KickChannelsModal/KickChannelsModal';
import { TwitchChannelsModal } from '../twitch/TwitchChannelsModal/TwitchChannelsModal';
import { YouTubeChannelsModal } from '../youtube/YouTubeChannelsModal/YouTubeChannelsModal';
import './Modules.scss';

export function Modules(): JSX.Element {
  const { modules, commands } = useAPI();

  return (
    <div className="modules">
      {modules.data.map(mod =>
        <Card className="module" title={mod.name} key={mod.slug}>
          <Toggle
            className="module__toggle"
            defaultChecked={mod.settings.isEnabled || mod.isLocked}
            isLocked={mod.isLocked}
            onChange={async (checked) => {
              await modules.updateModuleSettings(mod.slug, { isEnabled: checked });
              await Promise.all([
                modules.updateModules(),
                commands.update()
              ]);
            }}
          />
          <p className="module__description">{mod.description}</p>
          <ModuleModals slug={mod.slug} />
        </Card>
      )}
    </div>
  );
}

function ModuleModals({ slug }: {slug: string}): ReactNode {
  switch (slug) {
    case 'kick': {
      return <KickChannelsModal />;
    }
    case 'twitch': {
      return <TwitchChannelsModal />;
    }
    case 'youtube': {
      return <YouTubeChannelsModal />;
    }
  }

  return null;
}