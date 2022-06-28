import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faShieldAlt } from '@fortawesome/free-solid-svg-icons'

import { Context } from '../Store.jsx'

import logo from '../assets/images/logo.png'

export default function Sidebar() {
  const { guild } = useContext(Context)

  return (
    <StyledSidebar>
      <StyledSidebarHeader>
        <StyledLogo src={logo} alt="bot logo"/>
        <StyledTitle>Butleren</StyledTitle>
      </StyledSidebarHeader>

      <StyledSidebarNav>
        <StyledSidebarLink to="/">
          <FontAwesomeIcon className="icon" icon={faHome} />
          <span>Home</span>
        </StyledSidebarLink>

        <StyledSidebarLink to={`/guild/${guild.id}`}>
          <FontAwesomeIcon className="icon" icon={faShieldAlt} />
          <span>Guild</span>
        </StyledSidebarLink>
      </StyledSidebarNav>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  background-color: var(--color-gray--800);
  position: fixed;
  width: 4rem;
  padding: .75em;
  height: 100vh;
  inset-block: 0;
  inset-inline-start: 0;
  border-inline-end: .0625rem solid var(--color-turquoise--400);
  z-index: 10;

  @media (min-width: 64em) {
    width: 16rem;
    padding: 2em;
  }
`

const StyledSidebarHeader = styled.header`
  margin-block: 1em 2em;
  
  @media (min-width: 64em) {
    display: flex;
    gap: 1em;
    align-items: center;
  }
`

const StyledLogo = styled.img`
  border-radius: .5rem;
    
  @media (min-width: 64em) {
    max-width: 6em;
  }
`

const StyledTitle = styled.h2`
  display: none;
  text-transform: uppercase;
  font-weight: 800;

  @media (min-width: 64em) {
    display: block;
  }
`

const StyledSidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25em;
  font-size: 1.5rem;

  @media (min-width: 64em) {
    align-items: start;
    gap: 3em;
    margin-block-start: 3em;
    font-size: 1.2rem;
  }
`

const StyledSidebarLink = styled(NavLink)`
  color: var(--color-gray--200);

  @media (min-width: 64em) {
    display: flex;
    text-decoration: none;
    gap: 1em;
    align-content: center;
    align-items: center;
  }

  &:hover {
    color: var(--color-gray--100);
    text-decoration: none;
  }

  &.active {
    color: var(--color-gray--100);
    
    .icon {
      color: var(--color-turquoise--400);
    }
  }

  span {
    display: none
  }

  @media (min-width: 64em) {
    span{ display: inline-block; }
  }
`