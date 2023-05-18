import DiscordJS, { ChatInputCommandInteraction } from 'discord.js';
import moment from 'moment-timezone';

import fetchTwitchUsers from '../../utils/fetchTwitchUsers';
import fetchTwitchStreams from '../../utils/fetchTwitchStreams';

export default async function stream(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply();

    const channel = interaction.options.get('channel');
    const username = 'string' === typeof channel?.value && channel.value.split(' ').shift();

    if (!username) return;

    const [user] = await fetchTwitchUsers({ ids: [], usernames: [username.toLowerCase()] });

    if (!user) return interaction.editReply({
      content: `Sorry, i was unable to find "${username}" on twitch :(`,
    });

    const [stream] = await fetchTwitchStreams({ ids: [user.id], usernames: [] });
    const embed = new DiscordJS.EmbedBuilder();

    embed.setColor('#9146FF'); // Twitch purple
    embed.setThumbnail(user.profile_image_url);

    if (stream) {
      embed.setTitle(`${user.display_name} is streaming on Twitch`);
      embed.setURL(`https://twitch.tv/${user.login}`);
      embed.setDescription(`**${stream.title}**`);
      embed.setImage(stream.thumbnail_url.replace('{width}', '400').replace('{height}', '225'));
      embed.addFields(
        { name: 'Category', value: stream.game_name },
        { name: 'Viewers', value: stream.viewer_count.toLocaleString() },
        { name: 'Started', value: `<t:${moment(stream.started_at).format('X')}:R>` }
      );

    } else {
      embed.setTitle(`${user.display_name} is offline`);
      embed.setURL(`https://twitch.tv/${user.login}`);
      embed.setDescription(`**${user.description}**`);
      embed.setImage(user.offline_image_url.replace('{width}', '400').replace('{height}', '225'));
    }

    interaction.editReply({ embeds: [embed] });

  } catch (err) {
    console.error(err);
  }
}