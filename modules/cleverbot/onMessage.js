/**
 * @param {Object} param 
 * @param {Object} param.message   - Discord message object.
 * @param {Object} param.cleverbot - Cleverbot.
 * @returns {Promise<void>}
 */
export default async function cleverbotOnMessage(message, cleverbot) {
  const args   = message.content.split(' ')
  const handle = args.shift()

  if (`<@${message.client.user.id}>` != handle) return

  cleverbot.write(args.join(' '), (answer) => message.reply(answer.message))
}