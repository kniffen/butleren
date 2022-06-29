import { createContext, useState, useEffect } from 'react' 
import { useParams } from 'react-router-dom'

export const Context = createContext()

export default function Store({ children }) {
  const params = useParams()
  const [ guild, setGuild ] = useState(null)
  const [ discordChannels, setDiscordChannels ] = useState([])
  const [ discordRoles, setDiscordRoles ] = useState([])

  useEffect(function() {
    if (params.guild == guild?.id) return

    fetch(`/api/guilds/${params.guild}`)
      .then(res => res.json())
      .then(setGuild)
      .catch(console.error)

    fetch(`/api/guilds/${params.guild}/channels`)
      .then(res => res.json())
      .then(setDiscordChannels)
      .catch(console.error)

    fetch(`/api/guilds/${params.guild}/roles`)
      .then(res => res.json())
      .then(setDiscordRoles)
      .catch(console.error)
  }, [params])
  
  return (
    <Context.Provider value={{guild, discordChannels, discordRoles}}>
      {children}
    </Context.Provider>
  )
}