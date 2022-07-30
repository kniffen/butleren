import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Context } from '../../Store.jsx'

import DashboardLayout from '../../layouts/Dashboard'

import ModulePageHeader from '../../components/ModulePageHeader'
import LoadingBox from  '../../components/LoadingBox'
import Entries from '../../components/Entries'

export default function Spotify() {
  const params = useParams()
  const { discordChannels, discordRoles } = useContext(Context)
  const [ uri, setURI ] = useState(`/api/spotify/${params.guild}/shows`)
  const [ shows, setShows] = useState(null)

  const fields = [
    {
      name: 'id',
      type: 'text',
      isHidden: true,
      isReadOnly: true,
      isRequired: true,
      search: {
        generateURI: (query) => `/api/spotify/search?q=${query}&type=show&limit=4`,
        parseResults: (results) => results.map(show => ({
          id:    show.id,
          name:  show.name,
          image: show.thumbnailURL,
        }))
      }
    },
    {
      title:      'Show',
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
  
  async function fetchAndSetShows() {
    try {
      setShows(await fetch(uri).then(res => res.json()))
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(function() {
    setURI(`/api/spotify/${params.guild}/shows`)
    fetchAndSetShows()
  }, [params])

  return (
    <DashboardLayout>
      <ModulePageHeader
        title="Spotify"
        id="spotify"
        guild={params.guild}
      />

      {!shows
        ? <StyledLoadingBox />
        : <StyledEntries
            title="Shows"
            uri={uri}
            entries={shows}
            fields={fields}
            onUpdate={() => fetchAndSetShows()}
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