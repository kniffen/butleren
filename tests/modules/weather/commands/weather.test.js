import DiscordJS from 'discord.js'
import fetchMock from 'node-fetch'

import database from '../../../../database/index.js'
import * as command from '../../../../modules/weather/commands/weather.js'

describe('modules.weather.commands.weather', function() {
  let db = null
  let interaction = null
  let expectedEmbed = null
  let weatherData = null

  beforeAll(async function() {
    db = await database

    await db.migrate()
    await db.run('INSERT INTO guilds (id) VALUES (?)', ['guild001'])
    await db.run('INSERT INTO users (id, location) VALUES (?,?)', ['user001', 'location001'])
    await db.run('INSERT INTO users (id, location) VALUES (?,?)', ['user002', 'location002'])
  })

  beforeEach(function() {
    jest.clearAllMocks()
    
    fetchMock.mockImplementation(async () => ({
      json: async () => weatherData
    }))
    
    weatherData = {
      name: 'weather_name',
      dt: 10000,
      timezone: 500,
      sys: {
        country: 'weather_country',
        sunrise: 20000,
        sunset: 30000
      },
      weather: [{
        main: 'weather_weather_main',
        icon: 'weather_weather_icon',
        description: 'weather_weather_description',
      }],
      wind: {
        speed: 12.34,
        deg: 45,
      },
      rain: {
        '1h': 55
      },
      main: {
        temp: 65,
        feels_like: 66,
        humidity: 50
      },
    }

    interaction = {
      guild: {
        id: 'guild001'
      },
      user: {
        id: 'user001',
        username: 'username001'
      },
      options: new DiscordJS.Collection(),
      reply: jest.fn()
    }

    expectedEmbed = new DiscordJS.MessageEmbed()

    expectedEmbed.setColor('#19D8B4')
    expectedEmbed.setAuthor({name: 'Weather report for username001', iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'})
    expectedEmbed.addField('January 1, 1970 2:55 AM', 'weather_weather_main (weather_weather_description)')
    expectedEmbed.addField('💨 Wind', '12.3m/s\n27.6mph\nNortheast', true)
    expectedEmbed.addField('🌧️ Rain (1h)', '55mm\n2.17inch', true)
    expectedEmbed.addField('🌡️ Temp | Feels like', '65°C | 66°C\n149°F | 151°F', true)
    expectedEmbed.addField('🌅 Sunrise', '5:41 AM', true)
    expectedEmbed.addField('🌇 Sunset', '8:28 AM', true)
    expectedEmbed.addField('💦 Humidity', '50%', true)
    expectedEmbed.setFooter({text: "Weather report provided by OpenWeather"})
  })

  it('should contain certain properties', function() {
    expect(command).toEqual({
      data: {
        name: 'weather',
        description: 'Get a weather report for a location',
        options: [
          {
            description: 'Location name or zip code',
            name: 'location',
            required: false,
            type: 3,
          },
          {
            description: 'A user',
            name: 'user',
            required: false,
            type: 6,
          }
        ],
      },
      isLocked: false,
      execute: expect.anything()
    })
  })

  it('should fetch a weather report for the user', async function() {
    await command.execute(interaction)

    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location001&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should handle there being no rain data', async function() {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        ...weatherData,
        rain: undefined
      })
    }))

    const rainField = expectedEmbed.fields.find(field => '🌧️ Rain (1h)' === field.name)
    rainField.name  = '🌧️ Rain (3h)'
    rainField.value = '0.00mm\n0.00inch'

    await command.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should handle there being snow data', async function() {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        ...weatherData,
        rain: undefined,
        snow: {'1h': 555}
      })
    }))

    const rainField = expectedEmbed.fields.find(field => '🌧️ Rain (1h)' === field.name)
    rainField.name  = '🌨️ Snow (1h)'
    rainField.value = '555mm\n21.85inch'

    await command.execute(interaction)

    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should fetch a weather report for a targeted user', async function() {
    interaction.options.set('user', {
      user: {
        id: 'user002',
        username: 'username002'
      }
    })

    expectedEmbed.setAuthor({
      name: 'Weather report for username002',
      iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'
    })

    await command.execute(interaction)

    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location002&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should fetch a weather report for a location', async function() {
    interaction.options.set('location', {value: 'location999'})

    expectedEmbed.setAuthor({
      name: 'Weather report for weather_name (weather_country)',
      iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'
    })

    await command.execute(interaction)

    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location999&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should fetch a weather report for a zip code', async function() {
    interaction.options.set('location', {value: '1234'})

    expectedEmbed.setAuthor({
      name: 'Weather report for weather_name (weather_country)',
      iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'
    })

    await command.execute(interaction)

    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?zip=1234&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should handle the user not having a location stored in the database', async function() {
    interaction.user.id = 'user999'

    await command.execute(interaction)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Missing location',
      ephemeral: true
    })
  })

  it('should handle the location not existing', async function() {
    fetchMock.mockRejectedValue('Error message')

    await command.execute(interaction)

    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to fetch a weather report for you',
      ephemeral: true
    })
  })

})