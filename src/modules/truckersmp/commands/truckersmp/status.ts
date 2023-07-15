import DiscordJS, { ChatInputCommandInteraction } from 'discord.js';

export default async function gametime(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply();

    const [gameTime, servers]: [TruckersMPGameTime, TruckersMPServer] = await Promise.all([
      fetch('https://api.truckersmp.com/v2/game_time').then(res => res.json()),
      fetch('https://api.truckersmp.com/v2/servers').then(res => res.json()),
    ]);

    const embed = new DiscordJS.EmbedBuilder();
    const dd = (d: number): string => 10 > d ? `0${d}` : d.toString();
    const hh = dd(Math.floor(gameTime.game_time / 60 % 24));
    const mm = dd(Math.round(gameTime.game_time % 60));

    embed.setColor('#B92025'); // TruckersMP red
    embed.setTitle('TruckersMP server status');

    embed.addFields(servers.response.map(server => ({
      name: `${server.online ? '🟢' : '🔴'} ${server.name}`,
      value: `Players: ${server.players.toLocaleString()}/${server.maxplayers.toLocaleString()}`,
      inline: true
    })));

    embed.setFooter({ text: `Current in-game time: ${hh}:${mm}` });

    interaction.editReply({ embeds: [embed] });

  } catch (err) {
    console.error(err);

    interaction.editReply({
      content: 'Sorry, I was unable fetch the current status of TruckersMP for you :(',
    });
  }
}