import { useContext } from 'react'
import styled from 'styled-components'

import DashboardLayout from '../layouts/Dashboard'

import { Context } from '../Store'

import Box from '../components/Box'

export default function Guild() {
  const { guild } = useContext(Context)

  return (
    <DashboardLayout>
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