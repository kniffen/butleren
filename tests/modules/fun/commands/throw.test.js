import * as command from '../../../../modules/fun/commands/throw.js'

describe('fun: commands: throw', function() {
  const interaction = {
    options: new Map(),
    reply: jest.fn(),
  }

  interaction.options.set('item', {value: 'foobar'})

  beforeAll(async function() {
    command.execute(interaction)
  })

  it('should contain certain properties', function() {
    expect(command).toEqual({
      data: {
        name: 'throw',
        name_localizations: undefined,
        description: 'Throws things!',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [{
          autocomplete: undefined,
          choices: undefined,
          description: 'item to throw',
          description_localizations: undefined,
          name: 'item',
          name_localizations: undefined,
          required: true,
          type: 3,
        }],
      },
      isLocked: false,
      execute: expect.anything()
    })
  })

  it('should throw the item', async function() {
    expect(interaction.reply).toHaveBeenCalledWith({content: '(╯°□°）╯︵ foobar'})
  })
})