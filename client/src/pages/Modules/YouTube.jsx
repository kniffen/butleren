import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Context } from '../../Store.jsx'

import DashboardLayout from '../../layouts/Dashboard'

import Entries from '../../components/Entries'

export default function Twitter() {
  const params = useParams()
  const { discordChannels, discordRoles } = useContext(Context)
  const [ uri, setURI ] = useState(`/api/youtube/${params.guild}/channels`)
  const [ channels, setChannels] = useState([])

  const fields = [
    {
      name: 'id',
      type: 'text',
      isHidden: true,
      isReadOnly: true,
      isRequired: true,
      search: {
        generateURI: (query) => `/api/youtube/search?q=${query}&limit=4`,
        parseResults: (results) => results.map(channel => ({
          id:    channel.id.channelId,
          name:  channel.snippet.title,
          image: channel.snippet.thumbnails.default.url,
        }))
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
  
  async function fetchAndSetChannels() {
    try {
      setChannels(await fetch(uri).then(res => res.json()))
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(function() {
    setURI(`/api/youtube/${params.guild}/channels`)
    fetchAndSetChannels()
  }, [params])

  return (
    <DashboardLayout title="Modules: YouTube">
      <StyledEntries
        title="YouTube channels"
        uri={uri}
        entries={channels}
        fields={fields}
        onUpdate={() => fetchAndSetChannels()}
      />
    </DashboardLayout>
  )
}

const StyledEntries = styled(Entries)`
  @media (min-width: 48em) {
    grid-column: span 12;
  }
`