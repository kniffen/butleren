import { useMemo, useState, type JSX } from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Toggle.module.scss';

export interface ToggleProps {
  className?: string;
  defaultChecked: boolean;
  isLocked: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ className, defaultChecked, isLocked, onChange }: ToggleProps): JSX.Element {
  const [checked, setChecked] = useState(defaultChecked);
  const [checking, setChecking] = useState(false);
  const id = useMemo(() => `toggle-${crypto.randomUUID()}`, []);

  return (
    <div className={classnames(
      styles.toggleWrapper,
      checking || isLocked ? styles.locked : null,
      checking ? styles.checking : null,
      className
    )}>
      <input
        id={id}
        className={styles.toggle}
        type="checkbox"
        checked={checked}
        onChange={async (e) => {
          if (isLocked || checking) {
            return;
          }

          setChecking(true);
          setChecked(e.target.checked);
          await onChange(e.target.checked);
          setChecking(false);
          // TODO: handle request failing
        }}
      />
      <label className={styles.toggleLabel} htmlFor={id}></label>
    </div>
  );
}