import { logger } from '../../logger/logger.js'

/**
 * @param {Object} param 
 * @param {Object} param.message   - Discord message object.
 * @param {Object} param.cleverbot - Cleverbot.
 * @returns {Promise<void>}
 */
export default async function cleverbotOnMessage(message, cleverbot) {
  const args   = message.content.split(' ')
  const handle = args.shift()

  if (`<@${message.client.user.id}>` !== handle) return

  try {
    const query = args.join(' ');
    logger.info('Cleverbot message', {query});

    cleverbot.write(query, (answer) => {
      logger.info('Cleverbot reply', {answer: answer.message});
      logger.debug('Cleverbot reply', {answer});
      message.reply(answer.message)
    })
  } catch (err) {
    logger.error('Cleverbot', err)
  }
}