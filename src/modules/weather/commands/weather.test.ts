import DiscordJS, { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'

import database from '../../../database'
import * as command from './weather.js'

describe('modules.weather.commands.weather', function() {
  let db: Awaited<typeof database>
  let interaction: Partial<ChatInputCommandInteraction>
  let expectedEmbed: EmbedBuilder
  let weatherData: unknown

  const fetchMock = fetch as jest.MockedFunction<typeof fetch>

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
    } as Response))

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
      deferReply: jest.fn(),
      editReply: jest.fn()
    } as unknown as ChatInputCommandInteraction

    expectedEmbed = new DiscordJS.EmbedBuilder()

    expectedEmbed.setColor('#19D8B4')
    expectedEmbed.setAuthor({name: 'Weather report for username001', iconURL: 'http://openweathermap.org/img/wn/weather_weather_icon.png'})
    expectedEmbed.setFooter({text: 'Weather report provided by OpenWeather'})
    expectedEmbed.addFields(
      {
        name:   'January 1, 1970 2:55 AM',
        value:  'weather_weather_main (weather_weather_description)'
      },
      {
        name:   '💨 Wind',
        value:  '12.3m/s\n27.6mph\nNortheast',
        inline: true
      },
      {
        name:   '🌧️ Rain (1h)',
        value:  '55mm\n2.17inch',
        inline: true
      },
      {
        name:   '🌡️ Temp | Feels like',
        value:  '65°C | 66°C\n149°F | 151°F',
        inline: true
      },
      {
        name:   '🌅 Sunrise',
        value:  '5:41 AM',
        inline: true
      },
      {
        name:   '🌇 Sunset',
        value:  '8:28 AM',
        inline: true
      },
      {
        name: '💦 Humidity',
        value: '50%',
        inline: true
      }
    )
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

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location001&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should output a special weather report on april foold', async function() {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        ...weatherData,
        dt: 1680307200
      })
    }))

    jest.spyOn(global.Math, 'random').mockReturnValue(0.5)

    expectedEmbed = new DiscordJS.EmbedBuilder()

    expectedEmbed.setColor('#19D8B4')
    expectedEmbed.setAuthor({name: 'Weather report for username001', iconURL: 'http://openweathermap.org/img/wn/02d.png'})
    expectedEmbed.setFooter({text: 'Weather report provided by the Union Aerospace Corporation'})
    expectedEmbed.addFields([
      {
        name: 'April 1, 3023 12:08 AM',
        value: 'Hot and cloudy',
      },
      {
        inline: true,
        name: '🌬️ Zephyr',
        value: '12340.0 sec/km\n485827.0 thou/sec\nNortheast',
      },
      {
        inline: true,
        name: '☔ Acid deposition',
        value: '55000000 µm\n2165.36 thou',
      },
      {
        inline: true,
        name: '☢️ Radiation',
        value: '1100 nSv/h\n11000000 mR/h',
      },
      {
        inline: true,
        name: '🌆 Natural light',
        value: '05:41:40',
      },
      {
        inline: true,
        name: '💡 Illumination',
        value: '08:28:20',
      },
      {
        inline: true,
        name: '🫧 Carbon dioxide',
        value: '50%',
      },
    ])

    await command.execute(interaction)

    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })

    Math.random.mockRestore()
  })

  it('should handle there being no rain data', async function() {
    fetchMock.mockImplementation(async () => ({
      json: async () => ({
        ...weatherData,
        rain: undefined
      })
    }))

    expectedEmbed.data

    const rainField = expectedEmbed.data.fields.find(field => '🌧️ Rain (1h)' === field.name)
    rainField.name  = '🌧️ Rain (3h)'
    rainField.value = '0.00mm\n0.00inch'

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(interaction.editReply).toHaveBeenCalledWith({
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

    const rainField = expectedEmbed.data.fields.find(field => '🌧️ Rain (1h)' === field.name)
    rainField.name  = '🌨️ Snow (1h)'
    rainField.value = '555mm\n21.85inch'

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(interaction.editReply).toHaveBeenCalledWith({
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

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location002&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.editReply).toHaveBeenCalledWith({
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

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?q=location999&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.editReply).toHaveBeenCalledWith({
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

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?zip=1234&units=metric&APPID=open_weather_map_api_key')
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    })
  })

  it('should handle the user not having a location stored in the database', async function() {
    interaction.user.id = 'user999'

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Missing location',
      ephemeral: true
    })
  })

  it('should handle the location not existing', async function() {
    fetchMock.mockRejectedValue('Error message')

    await command.execute(interaction)

    expect(interaction.deferReply).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Error message')
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable to fetch a weather report for you',
      ephemeral: true
    })
  })

})