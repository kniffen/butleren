import fetchMock from 'node-fetch'

import * as command from '../../../../modules/fun/commands/dadjoke.js'

describe('fun: commands: dadjoke', function() {
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
        name: 'dadjoke',
        name_localizations: undefined,
        description: 'Posts a random dad joke',
        description_localizations: undefined,
        defaultPermission: undefined,
        options: [],
      },
      isLocked: false,
      execute: expect.anything()
    })
  })

  it('should post a random dad joke', async function() {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        joke: 'foobar'
      })
    }))

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://icanhazdadjoke.com/', {headers: {'Accept': 'application/json'}})
    expect(interaction.editReply).toHaveBeenCalledWith({content: 'foobar'})
  })

  it('should post a fallback cat image if the request failed', async function() {
    const err = new Error('error message')
    fetchMock.mockImplementation(async () => { throw err })

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://icanhazdadjoke.com/', {headers: {'Accept': 'application/json'}})
    expect(console.error).toHaveBeenCalledWith(err)
    expect(interaction.editReply).toHaveBeenCalledWith('Sorry, I was unable to fetch a dad joke for you.')
  })
})