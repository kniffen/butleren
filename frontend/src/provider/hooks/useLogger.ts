import { useCallback, useMemo } from 'react';
import type { LogEntry } from '../../types';

export interface LoggerHook {
  getLogEntries: (date: string) => Promise<LogEntry[]>;
}

export const useLogger = (): LoggerHook => {
  const getLogEntries = useCallback(async (date: string) => {
    const res = await fetch(`/api/logger/logs?date=${date}`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as LogEntry[];
    data.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    return data;
  }, []);

  return useMemo(() => ({
    getLogEntries,
  }), [getLogEntries]);
};
