import fetch from 'node-fetch'

let token = null

export default async function fetchTwitchToken(isTokenExpired = false) {
  if (null !== token && !isTokenExpired) return token

  const uri = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=user:read:email`
  const init = {
    method: 'POST'
  }

  const res  = await fetch(uri, init)
  const data = await res.json()

  token = data.access_token

  return token
}