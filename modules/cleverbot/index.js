import Cleverbot from 'cleverbot-node'

import _onMessage from './onMessage.js'

const cleverbot = new Cleverbot()

if ( !process.env.CLEVERBOT_API_KEY )
  throw new Error("Missing Cleverbot API key")

cleverbot.configure({botapi: process.env.CLEVERBOT_API_KEY})

export const id = 'cleverbot'
export const name = 'Cleverbot'
export const allowedChannelTypes = ['GUILD_TEXT']
export const description = 'Talk to the artificial intelligence known as Cleverbot'
export const isLocked = false
export const onMessage = (message) => _onMessage(message, cleverbot)