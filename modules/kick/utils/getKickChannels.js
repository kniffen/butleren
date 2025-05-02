import fetch from 'node-fetch';
import { getKickAppAccessToken } from './getKickAppAccessToken.js';
import { logger } from '../../../logger/logger.js'

/**
 * @typedef KickChannelsResponseBody
 * @type {Object}
 * @property {KickChannel[]} data - The array of channels.
 * @property {string} message - The message of the response.
 */

// TODO: add logs

/**
 * @param {Object} params - The parameters for the function.
 * @param {string[]} [params.broadcasterUserIds] - The array of broadcaster user IDs.
 * @param {string[]} [params.slugs] - The array of slugs.
 * @returns {Promise<KickChannel[]>} - The array of Kick channels.
 */
export const getKickChannels = async function({ broadcasterUserIds, slugs }) {
  try {
    const appAccessToken = await getKickAppAccessToken();
    const baseURL = 'https://api.kick.com/public/v1/channels'

    const params = new URLSearchParams();
    if (broadcasterUserIds) {
      broadcasterUserIds.forEach(broadcasterUserId => {
        params.append('broadcaster_user_id', broadcasterUserId)
      });
    } else if (slugs) {
      slugs.forEach(slug => {
        params.append('slug', slug)
      });
    } else {
      throw new Error('Either broadcasterUserId or slug must be provided')
    }

    const url = `${baseURL}?${params}`;
    logger.info('Kick API: /channels request', {url});
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${appAccessToken}`,
        'Content-Type': 'application/json',
      },
    })

    logger.info('Kick API: /channels response', {status: response.status});
    if (!response.ok) {
      throw new Error(`Failed to get channel: ${response.statusText}`);
    }

    /** @type {KickChannelsResponseBody} */
    const responseBody = await response.json();
    logger.debug('Kick API: /channels response body', {responseBody});
    return responseBody.data;

  } catch (err) {
    logger.error('Kick API: /channels', err);
    console.error('Error fetching channel:', err);
    return [];
  }
}
