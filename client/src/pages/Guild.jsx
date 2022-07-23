import { useContext, useState } from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'

import DashboardLayout from '../layouts/Dashboard'

import { Context } from '../Store'

import Box from '../components/Box'
import LoadingBox from '../components/LoadingBox'
import Button from '../components/Button'

export default function Guild() {
  const [ isFormSubmiting, setIsFormSubmiting ] = useState(false)
  const { guild } = useContext(Context)

  function handleSettingsSubmit(e) {
    e.preventDefault()

    setIsFormSubmiting(true)

    const formData = new FormData(e.target)
    const payload = new URLSearchParams(formData)

    fetch(`/api/guilds/${guild.id}`, {method: 'PUT', body: payload})
      .catch(console.error)
      .finally(() => setIsFormSubmiting(false))
  }


  if (!guild) return (
    <DashboardLayout>
      <StyledLoadingGuildStats height="15rem" />
      <StyledLoadingGuildStats height="15rem" />
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <Box title="Settings">
        <StyledForm onSubmit={handleSettingsSubmit}>
          <label>
            Nickname
            <input name="nickname" type="text" defaultValue={guild.nickname || ''} />
          </label>

          <label>
            Timezone
            <select name="timezone" defaultValue={guild.timezone || 'UTC'}>
              {moment.tz.names().map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>

          <label>
            Color
            <br/>
            <input type="color" name="color" defaultValue={guild.color} required/>
          </label>

          <Button type="submit" value="Save" isLoading={isFormSubmiting} />
        </StyledForm>
      </Box>

      <Box title="Guild statistics">
        <StyledGuildStatsList>
          <li>Categories: <b>{guild.categories || 0}</b></li>
          <li>Text channels: <b>{guild.textChannels || 0}</b></li>
          <li>Voice channels: <b>{guild.voiceChannels || 0}</b></li>
          <li>Roles: <b>{guild.roles || 0}</b></li>
        </StyledGuildStatsList>
      </Box>
    </DashboardLayout>
  )
}

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: flex-start;
`

const StyledLoadingGuildStats = styled(LoadingBox)`
  grid-column: span 12;

  @media (min-width: 48em) {
    grid-column: span 6;
  }
`

const StyledGuildStatsList = styled.ul`
  margin-block-start: 1em;
  padding-inline: 0;
  font-size: .9rem;
  list-style: none;

  > * + * {
    margin-block-start: 1em
  }
  
  b {
    color: var(--color-gray--100);
  }
`