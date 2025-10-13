# Butleren

![Branding](branding.png)

## About

Butleren is a small Discord bot built for automating social media announcement and serve data like weather reports via commands.

### Key features
- Weather and forecast reports
- Twitch live stream notifications
- Kick live stream notifications
- Spotify show (podcast) episode notifications
- YouTube video and live stream notifications

## Getting started

### Step 1: Clone the repository
```shell
git clone https://github.com/kniffen/butleren.git
cd butleren
git submodule update --init --recursive
```

### Step 2: Configure environment variables
Butleren connects to various APIs in order to provide features from them, here's a list of needed values and how to get them.
| Variable                 | Description                                                                   | Source                                              |
| ------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| PORT                     | Port the Butleren web UI runs on (defaults to 3000)                           |                                                     |
| LOGS_PATH                | Path to Butleren log files                                                    |                                                     |
| DISCORD_TOKEN            | Discord bot token                                                             | https://discord.com/developers                      |
| OPEN_WEATHER_MAP_API_KEY | Used to get location and weather data                                         | https://openweathermap.org/api                      |
| SPOTIFY_CLIENT_ID        | Used to get podcasts and episodes                                             | https://developer.spotify.com/documentation/web-api |
| SPOTIFY_CLIENT_SECRET    | Used to get podcasts and episodes                                             | https://developer.spotify.com/documentation/web-api |
| TWITCH_CLIENT_ID         | Used to get channel and live stream data                                      | https://dev.twitch.tv/docs/api/                     |
| TWITCH_CLIENT_SECRET     | Used to get channel and live stream data                                      | https://dev.twitch.tv/docs/api/                     |
| GOOGLE_API_KEY           | Used to get youtube channel, video and live stream data, and pollen forecasts | https://developers.google.com/                      |
| KICK_CLIENT_ID           | Used to get channel and live stream data                                      | https://dev.kick.com/                               |
| KICK_CLIENT_SECRET       | Used to get channel and live stream data                                      | https://dev.kick.com/                               |

Create a `.env` file in the root directory:
```env
# Required
DISCORD_TOKEN=your_discord_bot_token_here
OPEN_WEATHER_MAP_API_KEY=your_openweather_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
GOOGLE_API_KEY=your_google_api_key
KICK_CLIENT_ID=your_kick_client_id
KICK_CLIENT_SECRET=your_kick_client_secret

# Optional configuration
PORT=3000
LOGS_PATH=./logs
```

### Step 3: Install dependencies
```shell
npm install
```

### Step 4: Start the bot
Tune the following command
```shell
npm start
```

The web UI will be available at `http://localhost:3000` (or your configured PORT)

## License

Distributed under the MIT License. See the `LICENSE` file for more information.
