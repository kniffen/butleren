import express from 'express'
import supertest from 'supertest'

import discordClientMock from '../../discord/client'
import guildsRouter from './'

jest.mock('../../discord/client', () => ({
  __esModule: true,
  default: {
    guilds: {fetch: jest.fn()}
  }
}))

describe('/api/guilds/:guild/roles', function() {
  const app = express()
  const guilds = new Map()
  const roles  = new Map()

  beforeAll(function() {
    app.use('/api/guilds', guildsRouter)

    guilds.set('guild001', {
      id: 'guild001',
      roles: {
        fetch: jest.fn(async () => roles)
      },
    })

    roles.set('role001', {id: 'role001', name: 'rolename001'})
    roles.set('role002', {id: 'role002', name: 'rolename002'})

    const fetch = discordClientMock.guilds.fetch as jest.MockedFunction<typeof discordClientMock.guilds.fetch>
    fetch.mockImplementation((id) => {
      const guild = guilds.get(id)
      if (guild) return Promise.resolve(guild)
      return Promise.reject('Guild not found')
    })
  })

  beforeEach(function() {
    jest.clearAllMocks()
  })

  describe('GET', function() {
    it('should respond with a list of available roles', async function() {
      const res = await supertest(app).get('/api/guilds/guild001/roles')

      expect(res.body).toEqual([
        {id: 'role001', name: 'rolename001'},
        {id: 'role002', name: 'rolename002'},
      ])
    })

    it('should respond with a 404 error code if the guild could not be found', async function() {
      const res = await supertest(app).get('/api/guilds/guild999/roles')

      expect(res.status).toEqual(404)
      expect(console.error).toHaveBeenCalledWith('GET', '/api/guilds/guild999/roles', 'Guild not found')
    })
  })
})