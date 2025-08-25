import { useContext, useState } from 'react'
import styled from 'styled-components'

import DashboardLayout from '../layouts/Dashboard'

import { Context } from '../Store'

import Box from '../components/Box'
import LoadingBox from '../components/LoadingBox'
import Button from '../components/Button'

export default function Guild() {
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const { guild, discordChannels } = useContext(Context)

  function handleSettingsSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const payload = new URLSearchParams(formData);

    fetch('/api/chat', {method: 'POST', body: payload})
      .catch(console.error)
      .finally(() => setIsSubmitting(false))
  }


  if (!guild) return (
    <DashboardLayout>
      <StyledLoadingBox height="15rem" />
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <Box title="Chat">
        <StyledForm onSubmit={handleSettingsSubmit}>
          <label>
            Channel
            <select name="channel">
              {discordChannels.map(channel => 
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              )}
            </select>
          </label>

          <label>
            Message
            <textarea name="message" defaultValue={''} />
          </label>

          <Button type="submit" value="Send" isLoading={isSubmitting} />
        </StyledForm>
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

const StyledLoadingBox = styled(LoadingBox)`
  grid-column: span 12;
  height: 20rem;
`