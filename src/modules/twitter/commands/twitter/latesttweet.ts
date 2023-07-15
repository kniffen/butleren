import { ChatInputCommandInteraction } from 'discord.js';

import fetchTwitterUsers from '../../utils/fetchTwitterUsers';
import fetchTwitterUserTweets from '../../utils/fetchTwitterUserTweets';

export default async function latesttweet(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const handle = interaction.options.get('handle')?.value?.toString().split(' ').shift()?.replace('@', '');

  if (!handle) {
    interaction.editReply({
      content: 'Sorry, i was unable to find that use on Twitter :(',
    });
    return;
  }

  const user = (await fetchTwitterUsers({usernames: [handle]}))?.[0];

  if (!user) {
    interaction.editReply({
      content: `Sorry, i was unable to find "@${handle}" on Twitter :(`,
    });
    return;
  }

  const tweets = await fetchTwitterUserTweets(user.id);
  tweets.sort((a, b) => (a.created_at && b.created_at) ? b.created_at.localeCompare(a.created_at) : 0);

  if (1 > tweets.length) {
    interaction.editReply({
      content: `${user.name} does not appear to have any public tweets\nhttps://twitter.com/${user.username}`,
    });
    return;
  }

  interaction.editReply({
    content: `Latest tweet from ${user.name}\nhttps://twitter.com/${user.username}/status/${tweets[0].id}`
  });
}