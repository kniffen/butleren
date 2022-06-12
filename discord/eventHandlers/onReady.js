/**
 * Handler for the Discord client's ready event.
 * 
 * @param {Object} client - Discord client.
 */
 export default function onReady(client) {
  client.user.setActivity(process.env.npm_package_version)
  console.log('Discord: Client is ready.')
 }