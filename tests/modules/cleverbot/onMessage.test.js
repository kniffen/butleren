import onMessage from '../../../modules/cleverbot/onMessage.js'

describe('cleverbot: onMessage()', function() {
  const messages = [
    {
      content: '<@user001> foo bar',
      client: {user: {id: 'user001'}},
      reply: jest.fn(),
    },
    {
      content: '<@user002> foo qux',
      client: {user: {id: 'user001'}},
      reply: jest.fn(),
    },
    {
      content: 'foo quux',
      client: {user: {id: 'user001'}},
      reply: jest.fn(),
    }
  ]

  const cleverbotMock = {
    write: jest.fn(function(input, cb) {
      cb({message: 'bar foo'})
    }),
  }

  beforeAll(async function() {
    await Promise.all(messages.map(message => onMessage(message, cleverbotMock)))
  })

  it('should reply to messages with a clever response', async function() {
    expect(cleverbotMock.write).toHaveBeenCalledTimes(1)
    expect(cleverbotMock.write).toHaveBeenCalledWith('foo bar', expect.anything())
    expect(messages[0].reply).toHaveBeenCalledWith('bar foo')
    expect(messages[1].reply).not.toHaveBeenCalled()
    expect(messages[2].reply).not.toHaveBeenCalled()
  })
})
