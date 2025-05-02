/**
 * @typedef KickChannel
 * @type {Object}
 * @property {string} broadcaster_user_id - The ID of the broadcaster.
 * @property {string} slug - The slug of the channel.
 * @property {string} channel_description - The description of the channel.
 * @property {string} banner_picture - The URL of the channel's banner picture.
 * @property {string} stream_title - The title of the stream.
 * @property {Object} stream
 * @property {string} stream.url - The URL of the stream.
 * @property {string} stream.key - The stream key.
 * @property {boolean} stream.is_live - Whether the stream is live or not.
 * @property {boolean} stream.is_mature - Whether the stream is mature or not.
 * @property {string} stream.start_time - The start time of the stream.
 * @property {number} stream.viewer_count - The number of viewers.
 * @property {string} stream.thumbnail - The URL of the stream's thumbnail.
 * @property {Object} category - The category of the stream.
 * @property {string} category.id - The ID of the category.
 * @property {string} category.name - The name of the category.
 * @property {string} category.thumbnail - The URL of the category's thumbnail.
 */