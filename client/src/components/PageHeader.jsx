import styled from 'styled-components'

import LoadingBox  from './LoadingBox'

import placeholderImg from '../assets/images/placeholder.png'

export default function PageHeader({ guild }) {
  if (!guild.id)
    return (
      <StyledPageHeader>  
        <LoadingBox width="7rem" height="7rem" />
        <LoadingBox width="20rem" height="2rem" /> 
      </StyledPageHeader>  
    )

  return (
    <StyledPageHeader>
      <StyledPageHeaderLogo src={guild.iconURL || placeholderImg} alt={`${guild.name || ''} logo`}/>
      <h1>{guild.name || ''}</h1>
    </StyledPageHeader>
  )
}

const StyledPageHeader = styled.header`
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  color: var(--color-gray--100);
  margin-block-end: 2em;

  @media (min-width: 48em) {
    flex-direction: row;
  }
`

const StyledPageHeaderLogo = styled.img`
  width: 7rem;
  border-radius: 1rem;
`
