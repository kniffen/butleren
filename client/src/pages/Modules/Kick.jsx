import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Context } from '../../Store.jsx'

import DashboardLayout from '../../layouts/Dashboard.jsx'

import ModulePageHeader from '../../components/ModulePageHeader.jsx'
import LoadingBox from  '../../components/LoadingBox.jsx'
import Entries from '../../components/Entries.jsx'

export default function Kick() {
  const params = useParams()
  const { discordChannels, discordRoles } = useContext(Context)
  const [ uri, setURI ] = useState(`/api/kick/${params.guild}/channels`)
  const [ kickChannels, setKickChannels] = useState(null)

  const fields = [
    {
      name: 'broadcasterUserId',
      type: 'text',
      isHidden: true,
      isReadOnly: true,
      isRequired: true,
      search: {
        generateURI: (query) => `/api/kick/search?q=${query}`,
        parseResults: (results) => {
          return results.map(channel => ({
            id:    channel.broadcaster_user_id.toString(),
            name:  channel.slug,
            image: channel.banner_picture,
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

  async function fetchAndSetKickChannels() {
    try {
      setKickChannels(await fetch(uri).then(res => res.json()).then(kickChannels => kickChannels.map(kickChannel => ({...kickChannel, id: kickChannel.broadcasterUserId}))))
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(function() {
    setURI(`/api/kick/${params.guild}/channels`)
    fetchAndSetKickChannels()
  }, [params])

  return (
    <DashboardLayout>
      <ModulePageHeader
        title="Kick"
        id="kick"
        guild={params.guild}
      />

      {!kickChannels
        ? <StyledLoadingBox />
        : <StyledEntries
            title="Channels"
            uri={uri}
            entries={kickChannels}
            fields={fields}
            onUpdate={() => fetchAndSetKickChannels()}
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