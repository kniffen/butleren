import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faListAlt, faComment, faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import LoadingBox  from './LoadingBox'
import placeholderImg from '../assets/images/placeholder.png'

export default function PageHeader({ guild }) {
  if (!guild)
    return (
      <StyledPageHeader>
        <LoadingBox width="7rem" height="7rem" />
        <LoadingBox width="20rem" height="2rem" />
      </StyledPageHeader>
    )

  return (
    <StyledPageHeader>
      <StyledPageHeaderLogo src={guild.iconURL || placeholderImg} alt={`${guild.name || ''} logo`}/>
      <StyledHeading>{guild.name || ''}</StyledHeading>
      <GuildNav guild={guild} />
    </StyledPageHeader>
  )
}


function GuildNav({ guild }) {
  if (!guild) return null;

  return (
    <StyledNav>
      <StyledLink to={`/guild/${guild.id}`}>
        <FontAwesomeIcon className="icon" icon={faCog} />
        <span>Settings</span>
      </StyledLink>

      <StyledLink to={`/modules/${guild.id}`}>
        <FontAwesomeIcon className="icon" icon={faListAlt} />
        <span>Modules</span>
      </StyledLink>

      <StyledLink to={`/commands/${guild.id}`}>
        <FontAwesomeIcon className="icon" icon={faCommentAlt} />
        <span>Commands</span>
      </StyledLink>

      <StyledLink to={`/chat/${guild.id}`}>
        <FontAwesomeIcon className="icon" icon={faComment} />
        <span>Chat</span>
      </StyledLink>
    </StyledNav>
  )
}

const StyledPageHeader = styled.header`
  grid-column: span 12;
  display: grid;
  grid-template-columns: 7rem 1fr;
  grid-template-rows: auto auto;
  gap: 0 2rem;
  color: var(--color-gray--100);
  margin-block-end: 2em;

  @media (min-width: 48em) {
  }
`

const StyledHeading = styled.h1`
  margin-block-end: 0;
`

const StyledPageHeaderLogo = styled.img`
  width: 7rem;
  border-radius: 1rem;
  grid-row: 1/3;
`

const StyledNav = styled.nav`
  grid-column: 2/3;
  grid-row: 2/3;
  display: flex;
  gap: 1rem;
`

const StyledLink = styled(NavLink)`
  color: var(--color-gray--200);
  display: flex;
  gap: 0.5rem;

  &:hover {
    color: var(--color-gray--100);
    text-decoration: none;
  }

  &.active {
    color: var(--color-turquoise--400);
  }

  span{
    display: inline-block;
  }
`