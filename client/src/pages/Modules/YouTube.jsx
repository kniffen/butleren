import { useState, useEffect, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Context } from '../../Store.jsx'

import DashboardLayout from '../../layouts/Dashboard'

import ModulePageHeader from '../../components/ModulePageHeader'
import LoadingBox from  '../../components/LoadingBox'
import Entries from '../../components/Entries'

export default function YouTube() {
  const params = useParams()
  const { discordChannels, discordRoles } = useContext(Context)
  const channelsURL = useMemo(() => `/api/youtube/${params.guild}/channels`, [params])
  const liveChannelsURL = useMemo(() => `/api/youtube/${params.guild}/live-channels`, [params])
  const [ channels, setChannels] = useState(null)
  const [ liveChannels, setLiveChannels] = useState(null)

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

  const fetchAndSetChannels = async () => {
    try {
      const [
        channels,
        liveChannels
      ] = await Promise.all([
        fetch(channelsURL).then(res => res.json()),
        fetch(liveChannelsURL).then(res => res.json()),
      ])
      setChannels(channels);
      setLiveChannels(liveChannels);
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(function() {
    fetchAndSetChannels()
  }, [channelsURL, liveChannelsURL])

  return (
    <DashboardLayout>
      <ModulePageHeader
        title="YouTube"
        id="youtube"
        guild={params.guild}
      />

      {!channels
        ? <StyledLoadingBox />
        : <StyledEntries
            title="YouTube channels"
            uri={channelsURL}
            entries={channels}
            fields={fields}
            onUpdate={() => fetchAndSetChannels()}
          />
      }

      {!liveChannels
        ? <StyledLoadingBox />
        : <StyledEntries
            title="YouTube Live channels"
            uri={liveChannelsURL}
            entries={liveChannels}
            fields={fields}
            onUpdate={() => fetchAndSetChannels()}
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