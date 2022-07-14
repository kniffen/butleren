import styled from 'styled-components'

import Box from './Box'
import Toggle from './Toggle'

export default function CommandBox({ guild, id, name, description, isEnabled, isLocked, module: mod }) {
  function handleCommandToggle(shouldBeEnabled) {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({isEnabled: shouldBeEnabled})
    }

    return fetch(`/api/commands/${guild.id}/${mod.id}/${name}`, init)
      .then(() => shouldBeEnabled)
      .catch((err) => {
        console.error(err)
        return !shouldBeEnabled
      })
  }

  return (
    <StyledCommandBox title={`/${name}`}>
      <StyledCommandDescription>{description}</StyledCommandDescription>
      <StyledToggle isDefaultChecked={isEnabled} isLocked={isLocked} onChange={handleCommandToggle}/>
    </StyledCommandBox>
  )
}

const StyledCommandBox = styled(Box)`
  position: relative;

  @media (min-width: 48em) {
    grid-column: span 3;
  }
`

const StyledToggle = styled(Toggle)`
  position: absolute;
  inset-block-start: 1em;
  inset-inline-end: 1em;
`

const StyledCommandDescription = styled.p`
  margin: 0;

  @media (min-width: 48em) {
    font-size: .85rem;
  }
`