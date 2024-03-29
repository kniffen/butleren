import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Context } from '../../Store.jsx'

import DashboardLayout from '../../layouts/Dashboard'

import ModulePageHeader from '../../components/ModulePageHeader'
import LoadingBox from  '../../components/LoadingBox'
import Entries from '../../components/Entries'

export default function Twitter() {
  const params = useParams()
  const { discordChannels, discordRoles } = useContext(Context)
  const [ uri, setURI ] = useState(`/api/twitter/${params.guild}/users`)
  const [ twitterUsers, setTwitterUsers] = useState(null)

  const fields = [
    {
      name: 'id',
      type: 'text',
      isHidden: true,
      isReadOnly: true,
      isRequired: true,
      search: {
        generateURI: (query) => `/api/twitter/search?q=${query}`,
        parseResults: (results) => results.map(user => ({
          id:    user.id,
          name:  user.name,
          image: user.profile_image_url,
        }))
      }
    },
    {
      title:      'User',
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
  
  async function fetchAndSetTwitterUsers() {
    try {
      setTwitterUsers(await fetch(uri).then(res => res.json()))
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(function() {
    setURI(`/api/twitter/${params.guild}/users`)
    fetchAndSetTwitterUsers()
  }, [params])

  return (
    <DashboardLayout>
      <ModulePageHeader
        title="Twitter"
        id="twitter"
        guild={params.guild}
      />

      {!twitterUsers
        ? <StyledLoadingBox />
        : <StyledEntries
            title="Twitter users"
            uri={uri}
            entries={twitterUsers}
            fields={fields}
            onUpdate={() => fetchAndSetTwitterUsers()}
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