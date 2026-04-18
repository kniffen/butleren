import { useState, type JSX } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { Card } from '../Card/Card';
import { Toggle } from '../Toggle/Toggle';
import type { Command as CommandState } from '../../types';
import './Command.scss';
import { LoadingCard } from '../LoadingCard/LoadingCard';

export function Command({ command }: {command: CommandState}): JSX.Element {
  const { modules, commands } = useAPI();
  const [isRestoring, setIsRestoring] = useState(false);

  if (isRestoring) {
    return <LoadingCard height='auto'/>;
  }

  return (
    <Card className="command-card" title={`/${command.slug}`} key={command.slug}>
      <div className="command-card__controls">
        {!command.isLocked ? <span
          className="material-symbols-outlined command-card__restore"
          title="Restore to default state"
          onClick={async () => {
            setIsRestoring(true);
            await commands.restoreCommand(command.slug);
            await commands.update();
            setIsRestoring(false);
          }}
        >reset_wrench</span> : null}
        <Toggle
          className="command-card__toggle"
          defaultChecked={command.isEnabled || command.isLocked}
          isLocked={command.isLocked}
          onChange={async (checked: boolean) => {
            await commands.updateSettings(command.slug, { isEnabled: checked });
            await Promise.all([
              commands.update(),
              modules.updateModules()
            ]);
          }}
        />
      </div>
      <p className="command-card__description">{command.description}</p>
    </Card>
  );
}