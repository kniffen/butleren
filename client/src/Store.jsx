import { createContext, useState, useReducer, useEffect } from 'react' 
import { useParams } from 'react-router-dom'
import { v4 } from 'uuid'

import Notifications from './sections/Notifications'

export const Context = createContext()

export default function Store({ children }) {
  const params = useParams()
  const [ guild, setGuild ] = useState(null)
  const [ discordChannels, setDiscordChannels ] = useState([])
  const [ discordRoles, setDiscordRoles ] = useState([])

  const [ notifications, notificationsDispatch ] = useReducer(function(state, action) {
    switch (action.type) {
      case 'ADD_NOTIFICATION':
        const id = v4()
        return [...state, {id, ...action.payload}]

      case 'REMOVE_NOTIFICATION':
        return state.filter(notification => notification.id !== action.id);

      default:
        return state
    }
  }, [])

  useEffect(function() {
    if (!params.guild || params.guild == guild?.id) return

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
    <Context.Provider value={{guild, setGuild, discordChannels, discordRoles, notifications, notificationsDispatch}}>
      {children}
      <Notifications />
    </Context.Provider>
  )
}