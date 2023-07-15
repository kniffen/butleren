import { ChatInputCommandInteraction } from 'discord.js';

import {
  fetchSpotifySearch,
  fetchSpotifyShowEpisodes
} from '../../utils';

export const latestEpisodeSubCommand = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  const query = interaction.options.get('show')?.value?.toString();

  if (!query) {
    return interaction.editReply({
      content: 'Sorry, I was unable to fetch that show for you :(',
    });
  }

  const searchResults = await fetchSpotifySearch(query, 'show');
  const shows = searchResults.shows?.items;

  if (!shows || 1 > shows.length) {
    return interaction.editReply({
      content: 'Sorry, I was unable to fetch that show for you :(',
    });
  }

  const episodes = await fetchSpotifyShowEpisodes(shows[0].id);

  if (1 > episodes.length) {
    return interaction.editReply({
      content: `${shows[0].name} does not appear to have any recent episodes\n${shows[0].external_urls.spotify}`,
    });
  }

  episodes.sort((a, b) => b.release_date.localeCompare(a.release_date));

  interaction.editReply({
    content: `Latest episode from ${shows[0].name}\n${episodes[0].external_urls.spotify}`
  });
};