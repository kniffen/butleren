import styled from 'styled-components'

import Box from './Box'
import Toggle from './Toggle'

export default function ModuleBox({ guild, id, name, description, commands, isEnabled, isLocked }) {
  function handleModuleToggle(shouldBeEnabled) {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({isEnabled: shouldBeEnabled})
    }

    return fetch(`/api/modules/${guild.id}/${id}`, init)
      .then(() => shouldBeEnabled)
      .catch((err) => {
        console.error(err)
        return !shouldBeEnabled
      })
  }

  return (
    <StyledModuleBox title={name}>
      <StyledModuleDescription>{description}</StyledModuleDescription>
      <StyledToggle isDefaultChecked={isEnabled} isLocked={isLocked} onChange={handleModuleToggle}/>
    </StyledModuleBox>
  )
}

const StyledModuleBox = styled(Box)`
  position: relative;
`

const StyledToggle = styled(Toggle)`
  position: absolute;
  inset-block-start: 1em;
  inset-inline-end: 1em;
`

const StyledModuleDescription = styled.p`
  margin: 0;

  @media (min-width: 48em) {
    font-size: .85rem;
  }
`