import { useContext } from 'react'
import styled from 'styled-components'

import { Context } from '../Store'

import Sidebar from '../sections/Sidebar'

import placeholderImage from '../assets/images/placeholder.png'

export default function Dashboard({ children }) {
  const { guild } = useContext(Context)

  return (
    <>
      <Sidebar />
      <StyledDashboard>
        <StyledPageHeader>
          <StyledPageHeaderLogo src={guild.iconURL || placeholderImage} alt={`${guild.name || ''} logo`}/>
          <StyledPageHeaderTitle>{guild.name || ''}</StyledPageHeaderTitle>
        </StyledPageHeader>
        {children}
      </StyledDashboard>
    </>
  )
}

const StyledDashboard = styled.div`
  margin-block: 2rem;
  margin-inline: calc(5rem + .75rem * 2) 1rem;
  padding-inline: calc((100% - 75rem) / 2);
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 100%));
  gap: 1rem;
  align-items: start;

  @media (min-width: 64em) {
    margin-inline: 21rem 1rem;
  }
`

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

const StyledPageHeaderTitle = styled.h1`

`