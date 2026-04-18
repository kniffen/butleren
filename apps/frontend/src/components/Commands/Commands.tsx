import type { JSX } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { Command } from '../Command/Command';
import './Commands.scss';

export function Commands(): JSX.Element {
  const { commands } = useAPI();

  return (
    <div className="commands">
      {commands.data.map(command =>
        <Command command={command} key={command.slug} />
      )}
    </div>
  );
}