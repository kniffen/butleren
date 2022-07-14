import fetchMock from 'node-fetch'

import * as command from '../../../../modules/fun/commands/xkcd.js'

describe('fun: commands: xkcd', function() {
  const interaction = {
    options: new Map(),
    reply: jest.fn()
  }

  beforeAll(function() {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({img: 'foobar'})
    }))
  })

  afterAll(function() {
    jest.clearAllMocks()
  })

  it('should contain certain properties', function() {
    expect(command).toEqual({
      data: {
        name: 'xkcd',
        name_localizations: undefined,
        description: 'Posts XKCD comics',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [{
          autocomplete: undefined,
          choices: undefined,
          description: 'XKCD comic id',
          description_localizations: undefined,
          name: 'id',
          name_localizations: undefined,
          required: false,
          type: 3,
        }],
      },
      isLocked: false,
      execute: expect.anything()
    })
  })

  it('should respond with the latest XKCD comic', async function() {
    await command.execute(interaction)

    expect(fetchMock).toHaveBeenCalledWith('https://xkcd.com/info.0.json')
    expect(interaction.reply).toHaveBeenCalledWith({files: ['foobar']})
  })

  it('should respond with a specific XKCD comic', async function() {
    interaction.options.set('id', {value: 'foobar'})
    await command.execute(interaction)

    expect(fetchMock).toHaveBeenCalledWith('https://xkcd.com/foobar/info.0.json')
    expect(interaction.reply).toHaveBeenCalledWith({files: ['foobar']})
  })

  it('should respond with a fallback XKCD comic if one cannot be resolved', async function() {
    const err = new Error('error message')
    fetchMock.mockImplementation(async () => { throw err })

    await command.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({files: ['https://imgs.xkcd.com/comics/not_available.png']})
  })
})