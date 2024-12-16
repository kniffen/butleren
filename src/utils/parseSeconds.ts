import { dd } from "./dd.ts";

export const parseSeconds = (uptime: number): string => {
  const days = Math.floor(uptime / 86400);
  const hrs  = dd(Math.floor(uptime % 86400 / 3600));
  const min  = dd(Math.floor(uptime % 3600 / 60));
  const sec  = dd(Math.floor(uptime % 60));

  return `${days > 0 ? `${days} days ` : ''}${hrs}:${min}:${sec}`;
};