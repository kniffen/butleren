import styled from 'styled-components'

import Box from './Box'

export default function ModuleBox({ id, name, description, commands, isEnabled, isLocked }) {
  return (
    <StyledModuleBox title={name}>
      <StyledModuleDescription>{description}</StyledModuleDescription>
    </StyledModuleBox>
  )
}

const StyledModuleBox = styled(Box)``

const StyledModuleDescription = styled.p`
  margin: 0;

  @media (min-width: 48em) {
    font-size: .85rem;
  }
`