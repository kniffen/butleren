import type { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { Command } from '../../../types';

const slashCommandBuilder =
  new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flips things!')
    .addStringOption(option =>
      option
        .setName('item')
        .setDescription('item to flip')
        .setRequired(true),
    );

const execute = async (commandInteraction: CommandInteraction): Promise<void> => {
  const item        = commandInteraction.options.get('item')?.value?.toString() || '';
  const flippedItem = item.split('').map(char => charsMap.get(char) || char).reverse().join('');

  await commandInteraction.reply({ content: `(╯°□°）╯︵ ${flippedItem}` });
};

export const flipCommand: Command = {
  isLocked: false,
  slashCommandBuilder,
  execute,
};

const charsMap = new Map<string, string>([
  ['A', '∀'],
  ['B', '𐐒'],
  ['C', 'Ɔ'],
  ['E', 'Ǝ'],
  ['F', 'Ⅎ'],
  ['G', 'פ'],
  ['H', 'H'],
  ['I', 'I'],
  ['J', 'ſ'],
  ['L', '˥'],
  ['M', 'W'],
  ['N', 'N'],
  ['P', 'Ԁ'],
  ['R', 'ᴚ'],
  ['T', '⊥'],
  ['U', '∩'],
  ['V', 'Λ'],
  ['Y', '⅄'],
  ['a', 'ɐ'],
  ['b', 'q'],
  ['c', 'ɔ'],
  ['d', 'p'],
  ['e', 'ǝ'],
  ['f', 'ɟ'],
  ['g', 'ƃ'],
  ['h', 'ɥ'],
  ['i', 'ᴉ'],
  ['j', 'ɾ'],
  ['k', 'ʞ'],
  ['m', 'ɯ'],
  ['n', 'u'],
  ['p', 'd'],
  ['q', 'b'],
  ['r', 'ɹ'],
  ['t', 'ʇ'],
  ['u', 'n'],
  ['v', 'ʌ'],
  ['w', 'ʍ'],
  ['y', 'ʎ'],
  ['1', 'Ɩ'],
  ['2', 'ᄅ'],
  ['3', 'Ɛ'],
  ['4', 'ㄣ'],
  ['5', 'ϛ'],
  ['6', '9'],
  ['7', 'ㄥ'],
  ['8', '8'],
  ['9', '6'],
  ['0', '0'],
  ['.', '˙'],
  [',', '\''],
  ['\'', ','],
  ['"', ',,'],
  ['`', ','],
  ['<', '>'],
  ['>', '<'],
  ['∴', '∵'],
  ['&', '⅋'],
  ['_', '‾'],
  ['?', '¿'],
  ['!', '¡'],
  ['[', ']'],
  [']', '['],
  ['(', ')'],
  [')', '('],
  ['{', '}'],
  ['}', '{'],
  ['А', '∀'],
  ['Б', 'ܦ'],
  ['В', 'ꓭ'],
  ['Г', '⅃'],
  ['Д', 'ჩ'],
  ['Е', 'Ǝ'],
  ['З', 'Ɛ'],
  ['Й', 'И̯'],
  ['К', 'ꓘ'],
  ['Л', 'Ѵ'],
  ['М', 'ꟽ'],
  ['П', 'ⵡ'],
  ['Р', 'Ԁ'],
  ['С', 'Ͻ'],
  ['Т', 'ꓕ'],
  ['У', 'ʎ'],
  ['Ц', 'ŉ'],
  ['Ч', 'Ⴙ'],
  ['Ш', 'ᗰ'],
  ['Ь', 'ᑫ'],
  ['Э', 'Є'],
  ['Ю', 'Ꙕ'],
  ['Я', 'ᖉ'],
  ['а', 'ɐ'],
  ['б', 'ܦ'],
  ['в', 'ʚ'],
  ['г', '⅃'],
  ['д', 'ჩ'],
  ['е', 'ǝ'],
  ['з', 'ԑ'],
  ['й', 'и̯'],
  ['к', 'ʞ'],
  ['л', 'ѵ'],
  ['м', 'ᥕ'],
  ['п', '⊔'],
  ['р', 'd'],
  ['с', 'ɔ'],
  ['т', 'ꓕ'],
  ['у', 'ʎ'],
  ['ц', 'ŉ'],
  ['ч', 'h'],
  ['ш', 'm'],
  ['ь', '৭'],
  ['э', 'є'],
  ['ю', 'ꙕ'],
  ['я', 'ʁ'],
]);