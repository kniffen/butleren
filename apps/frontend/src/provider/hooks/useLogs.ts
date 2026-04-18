import { useCallback, useMemo } from 'react';
import type { LogEntry } from '../../types';

export interface LogsHook {
  getLogs: (date: string) => Promise<LogEntry[]>;
}

export const useLogs = (): LogsHook => {
  const getLogs = useCallback(async (date: string) => {
    const res = await fetch(`/api/logs?date=${date}`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as LogEntry[];
    data.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    return data;
  }, []);

  return useMemo(() => ({
    getLogs,
  }), [getLogs]);
};
