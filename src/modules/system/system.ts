import { Module } from '../../types.ts';
import { ping } from './commands/ping.ts';
import { status } from './commands/status.ts';

export const system: Module = {
  id: 'system',
  name: 'System',
  commands: [ping, status]
};