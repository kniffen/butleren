import DiscordJS, { ChatInputCommandInteraction } from 'discord.js';
import moment from 'moment-timezone';

import fetchTwitchUsers from '../../utils/fetchTwitchUsers';
import fetchTwitchSchedule from '../../utils/fetchTwitchSchedule';

export default async function schedule(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply();

    const channel = interaction.options.get('channel');
    const username = 'string' === typeof channel?.value && channel.value.split(' ').shift();

    if (!username) return;

    const [ user ] = await fetchTwitchUsers({ ids: [], usernames: [username.toLowerCase()] });

    if (!user) return interaction.editReply({
      content: `Sorry, i was unable to find "${username}" on twitch :(`,
    });

    const schedule = await fetchTwitchSchedule({ id: user.id });
    const embed = new DiscordJS.EmbedBuilder();

    if (1 > schedule.length) return interaction.editReply({
      content: `${user.display_name} does not appear to have a schedule configured`,
    });

    embed.setTitle(`Stream schedule for ${user.display_name}`);
    embed.setURL(`https://twitch.tv/${user.login}/schedule`);
    embed.setColor('#9146FF'); // Twitch purple
    embed.setThumbnail(user.profile_image_url);
    embed.setFooter({ text: 'Times are in your local timezone' });

    const fields = [];
    for (let i = 0; 3 > i && i < schedule.length; i++) {
      fields.push({
        name: `<t:${moment(schedule[i].start_time).format('X')}>`,
        value: `${schedule[i].title || 'Untitled'}${schedule[i].category ? ` (${schedule[i].category.name})` : ''}`,
      });
    }
    embed.addFields(...fields);

    interaction.editReply({ embeds: [embed] });

  } catch (err) {
    console.error(err);
    interaction.editReply({
      content: 'Something went horribly wrong',
    });
  }
}
