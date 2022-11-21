import fetchMock from 'node-fetch'

import * as command from '../../../../modules/fun/commands/dog.js'

describe('fun.commands.dog', function() {
  const interaction = {
    deferReply: jest.fn(),
    editReply: jest.fn()
  }

  afterAll(function() {
    jest.clearAllMocks()
  })

  it('should contain certain properties', function() {
    expect(command).toEqual({
      data: {
        name: 'dog',
        name_localizations: undefined,
        description: 'Posts a random dog image',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [],
      },
      isLocked: false,
      execute: expect.anything()
    })
  })

  it('should post a random dog image', async function() {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        message: 'foobar'
      })
    }))

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random')
    expect(interaction.editReply).toHaveBeenCalledWith({files: ['foobar']})
  })

  it('should post a fallback dog image if the request failed', async function() {
    const err = new Error('error message')
    fetchMock.mockImplementation(async () => { throw err })

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random')
    expect(console.error).toHaveBeenCalledWith(err)
    expect(interaction.editReply).toHaveBeenCalledWith({files: ['https://i.imgur.com/9oPUiCu.gif']})
  })

})