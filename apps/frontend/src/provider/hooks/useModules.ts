import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Guild, Module, ModuleSettings } from '../../types';

export interface ModulesHook {
  data: Module[];
  isLoading: boolean;
  updateModules: () => Promise<void>;
  updateModuleSettings: (slug: string, settings: ModuleSettings) => Promise<boolean>;
}

export const useModules = (guild: Guild | null): ModulesHook => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateModules = useCallback(async () => {
    if (!guild) {
      return;
    }

    setIsLoading(true);
    const res = await fetch(`/api/modules/${guild.id}`);
    if (!res.ok) {
      setModules([]);
      setIsLoading(false);
      return;
    }

    const data = await res.json() as Module[];
    data.sort((a, b) => a.name.localeCompare(b.name));

    setModules(data);
    setIsLoading(false);
  }, [guild]);

  const updateModuleSettings = useCallback(async (slug: string, settings: ModuleSettings): Promise<boolean> => {
    if (!guild) {
      return false;
    }

    const res = await fetch(`/api/modules/${slug}/${guild.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(settings),
    });

    return res.ok;
  }, [guild, updateModules]);

  useEffect(() => {
    updateModules();
  }, [guild]);

  return useMemo(() => ({
    data: modules,
    isLoading,
    updateModules,
    updateModuleSettings,
  }), [modules, isLoading, updateModules, updateModuleSettings]);
};