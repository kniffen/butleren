import database from '../../database/index.js'
import fetchYouTubeActivities from './utils/fetchYouTubeActivities.js'
import fetchYouTubeVideos from './utils/fetchYouTubeVideos.js'
import { logger } from '../../logger/logger.js'

export default async function youTubeOnInterval({ guilds, date }) {
  // This ensures that the logic will only run every hour on the hour
  // For example 11:00, 12:00, 13:00 etc...
  if (0 !== date.getMinutes() % 60) return
  logger.info('Running YouTube interval');

  try {
    const db = await database
    const enabledGuilds =
      (await db.all('SELECT guildId FROM modules WHERE id = ? AND isEnabled = ?', ['youtube', true]))
        .map(({ guildId}) => guildId)

    const youTubeChannelsEntries =
      (await db.all('SELECT * FROM youtubeChannels'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId));
    const youTubeLiveChannelsEntries =
      (await db.all('SELECT * FROM youtubeLiveChannels'))
        .filter(({ guildId }) => enabledGuilds.includes(guildId));

    const ids = [
      ...youTubeChannelsEntries,
      ...youTubeLiveChannelsEntries
    ].reduce((ids, entry) => ids.includes(entry.id) ? ids : [...ids, entry.id], []);
    const channelsActivities = await Promise.all(ids.map(channelId => fetchYouTubeActivities({channelId})));

    const thisHour = new Date(date)
    thisHour.setSeconds(0);
    const videoIds = channelsActivities.reduce((videoIds, channelActivities) => {
      return [
        ...videoIds,
        ...channelActivities
          .filter((activity) =>
            (3.6e+6 > thisHour.valueOf() - (new Date(activity.snippet.publishedAt)).valueOf()) &&
            activity.contentDetails?.upload
          )
          .map((activity) => activity.contentDetails.upload.videoId)
      ]
    }, []);

    if (1 > videoIds.length) return;
    const videos = await fetchYouTubeVideos({videoIds});

    // Live streams
    await Promise.all(youTubeLiveChannelsEntries.map((entry) => (async () => {
      const guild = guilds.find(({ id }) => id === entry.guildId)
      if (!guild) return;

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) return;

      const liveStreams = videos.filter((video) =>
        'live' === video.snippet.liveBroadcastContent &&
        video.snippet.channelId === entry.id
      );
      const mention = entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''

      liveStreams.forEach(stream => {
        const text =
          stream.snippet.channelTitle
            ? `${stream.snippet.channelTitle} is live on YouTube`
            : 'A livestream just started on YouTube';
        const link = `https://www.youtube.com/watch?v=${stream.id}`

        logger.info('Publishing youtube notification', {mention, text, link})
        notificationChannel.send({
          content: `${mention}${text}\n${link}`
        }).catch(console.error)
      })
    })()))

    // Uploads
    await Promise.all(youTubeChannelsEntries.map((entry) => (async () => {
      const guild = guilds.find(({ id }) => id === entry.guildId)
      if (!guild) return;

      const notificationChannel = await guild.channels.fetch(entry.notificationChannelId).catch(console.error)
      if (!notificationChannel) return;

      const uploadedVideos = videos.filter((video) =>
        'none' === video.snippet.liveBroadcastContent &&
        !video.liveStreamingDetails &&
        video.snippet.channelId === entry.id
      );

      if (1 > uploadedVideos.length) return;

      const mention = entry.notificationRoleId ? `<@&${entry.notificationRoleId}> ` : ''
      const text =
        1 < uploadedVideos.length
          ? 'New YouTube videos have been posted'
          : uploadedVideos[0].snippet.channelTitle
            ? `${uploadedVideos[0].snippet.channelTitle} posted a new YouTube video`
            : 'A new YouTube video has been posted'
      const links = uploadedVideos.map((video) => `https://www.youtube.com/watch?v=${video.id}`)

      logger.info('Publishing youtube notification', {mention, text, links})
      notificationChannel.send({content: `${mention}${text}\n${links.join('\n')}`}).catch(console.error)
    })()))

  } catch(err) {
    console.error(err)
  }
}