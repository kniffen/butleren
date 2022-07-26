import fetch from 'node-fetch'

let token = null

/**
 * Fetches a twitter oauth2 token.
 * 
 * @param {boolean} isTokenExpired - Has the token expired?
 * @returns 
 */
export default async function fetchTwitterToken(isTokenExpired = false) {
  if (null !== token && !isTokenExpired) return token

  const uri = 'https://api.twitter.com/oauth2/token'
  const init = {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const res  = await fetch(uri, init)
  const data = await res.json()

  token = data.access_token

  return token
}