import type { JSX } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import type { Module } from '../../types';
import { Card } from '../../components/Card/Card';
import styles from './Modules.module.scss';
import { Toggle } from '../../components/Toggle/Toggle';

export function Modules(): JSX.Element {
  const { modules } = useAPI();

  return (
    <>
      <h2>Modules</h2>
      <div className={styles.modules}>
        {modules.data.map(mod => <Module key={mod.slug} mod={mod} />)}
      </div>
    </>
  );
}

function Module({ mod }: { mod: Module }): JSX.Element {
  const { modules } = useAPI();
  return (
    <Card className={styles.module} title={mod.name}>
      <Toggle
        className={styles.toggle}
        defaultChecked={mod.settings.isEnabled || mod.isLocked}
        isLocked={mod.isLocked}
        onChange={async (checked) => {
          await modules.updateModuleSettings(mod.slug, { isEnabled: checked });
          await modules.updateModules();
        }}
      />
      <p>{mod.description}</p>
    </Card>
  );
}