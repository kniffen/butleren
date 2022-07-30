import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Context } from '../../Store.jsx'

import DashboardLayout from '../../layouts/Dashboard'

import ModulePageHeader from '../../components/ModulePageHeader'
import LoadingBox from  '../../components/LoadingBox'
import Entries from '../../components/Entries'

export default function Twitch() {
  const params = useParams()
  const { discordChannels, discordRoles } = useContext(Context)
  const [ uri, setURI ] = useState(`/api/twitch/${params.guild}/channels`)
  const [ twitchChannels, setTwitchChannels] = useState(null)

  const fields = [
    {
      name: 'id',
      type: 'text',
      isHidden: true,
      isReadOnly: true,
      isRequired: true,
      search: {
        generateURI: (query) => `/api/twitch/search?q=${query}&type=channels`,
        parseResults: (results, query) => {
          const exactMatch = results.find(channel => channel.broadcaster_login === query)
          const items = [exactMatch, ...results.filter(({ id }) => id != exactMatch.id)]
          
          if (items.length > 4) items.length = 4

          return items.map(channel => ({
            id:    channel.id,
            name:  channel.display_name,
            image: channel.thumbnail_url,
          }))
        }
      }
    },
    {
      title:      'Channel',
      name:       'name',
      type:       'text',
      isRequired: true,
      isReadOnly: true,
    },
    {
      title:      'Notification channel',
      name:       'notificationChannelId',
      type:       'select',
      isRequired: true,
      options:    discordChannels.map(({ id, name }) => ({id, value: name}))
    },
    {
      title:   'Notification role',
      name:    'notificationRoleId',
      type:    'select',
      options: [{id: null, value: ''}, ...discordRoles.map(({ id, name }) => ({id, value: name}))]
    }
  ]
  
  async function fetchAndSetTwitchChannels() {
    try {
      setTwitchChannels(await fetch(uri).then(res => res.json()))
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(function() {
    setURI(`/api/twitch/${params.guild}/channels`)
    fetchAndSetTwitchChannels()
  }, [params])

  return (
    <DashboardLayout>
      <ModulePageHeader
        title="Twitch"
        id="twitch"
        guild={params.guild}
      />

      {!twitchChannels
        ? <StyledLoadingBox />
        : <StyledEntries
            title="Channels"
            uri={uri}
            entries={twitchChannels}
            fields={fields}
            onUpdate={() => fetchAndSetTwitchChannels()}
          />
      }
    </DashboardLayout>
  )
}

const StyledLoadingBox = styled(LoadingBox)`
  grid-column: span 12;
  height: 20rem;
`

const StyledEntries = styled(Entries)`
  grid-column: span 12;
`