import type { Module, Command } from '../types';
import { system } from './system/system';
import { fun } from './fun/fun';

export const modules = new Map<string, Module>([
  [system.slug, system],
  [fun.slug, fun],
]);

export const commands = new Map<string, Command>([
  ...system.commands,
  ...fun.commands,
]);