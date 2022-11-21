import fetchSpotifySearch from '../../utils/fetchSpotifySearch.js'
import fetchSpotifyShowEpisodes from '../../utils/fetchSpotifyShowEpisodes.js'

export default async function latestepisode(interaction) {
  await interaction.deferReply()

  const query = interaction.options.get('show')?.value
  const shows = await fetchSpotifySearch(query)

  if (shows.length < 1) {
    return interaction.editReply({
      content: 'Sorry, I was unable to fetch that show for you :(',
      ephemeral: true
    })
  }

  const episodes = await fetchSpotifyShowEpisodes(shows[0].id)

  if (episodes.length < 1) {
    return interaction.editReply({
      content: `${shows[0].name} does not appear to have any recent episodes\n${shows[0].external_urls.spotify}`,
      ephemeral: true
    })
  }

  episodes.sort((a, b) => b.release_date.localeCompare(a.release_date))

  interaction.editReply({
    content: `Latest episode from ${shows[0].name}\n${episodes[0].external_urls.spotify}`
  })
}