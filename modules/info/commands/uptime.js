import { SlashCommandBuilder } from '@discordjs/builders'

export const isLocked = true
export const data =
  new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Uptime check')

const dd = (n) => 9 < n ? n : `0${n}`;

/**
 * @param {Object} interaction - Discord interaction object.
 */
export async function execute(interaction) {
  let sec = process.uptime();

  const days = Math.floor(sec / 86400);
  const hrs  = dd(Math.floor(sec % 86400 / 3600));
  const min =  dd(Math.floor(sec % 86400 % 3600 / 60));
  sec       =  dd(Math.floor(sec % 60));

  const dayStr = days > 0 ? `${days} days ` : ''
  const timestr = `${hrs}:${min}:${sec}`;

  await interaction.reply(`Uptime: ${dayStr}${timestr}`);
}
