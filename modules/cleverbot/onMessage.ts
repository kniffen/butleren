import { Message } from 'discord.js';

export default async function cleverbotOnMessage(message: Message, cleverbot: Cleverbot) {
  const args   = message.content.split(' ');
  const handle = args.shift();

  if (`<@${message.client.user.id}>` !== handle) return;

  cleverbot.write(args.join(' '), (answer) => message.reply(answer.message));
}