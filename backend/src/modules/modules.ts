import type { Module, Command } from "@/types";
import { system } from "./system/system";

export const modules = new Map<string, Module>([
  [system.slug, system],
]);

export const commands = new Map<string, Command>([
  ...system.commands,
]);