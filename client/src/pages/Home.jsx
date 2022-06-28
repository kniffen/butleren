import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import logo from '../assets/images/logo.png'
import placeholderImage from '../assets/images/placeholder.png'

export default function Home() {
  const [ guilds, setGuilds ] = useState([])

  useEffect(function() {
    fetch('/api/guilds')
      .then(res => res.json())
      .then(setGuilds)
      .catch(console.error)
  }, [])

  return (
    <StyledMain>
      <StyledHeader>
        <StyledLogo src={logo} />
        <h1>Butleren</h1>
      </StyledHeader>

      <StyledGuildsSection>
        <h2>Guilds</h2>
        <p>The bot is connected to {guilds.length} guilds.</p>
        <StyledGuildsContainer>
          {guilds.map(guild => <StyledGuildLink key={guild.id} to={`/guild/${guild.id}`}>
            <img src={guild.iconURL || placeholderImage}></img>
            <p>{guild.name}</p>
          </StyledGuildLink>)}
        </StyledGuildsContainer>
      </StyledGuildsSection>
    </StyledMain>
  )
}

const StyledMain = styled.main`
  min-height: 100vh;
  display: grid;
  justify-content: center;
  align-content: center;
  
  > * {
    max-width: 64rem;
    padding: 1em;
  }
`

const StyledHeader = styled.header`
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  margin-block-end: 1em;

  @media (min-width: 48em) {
    flex-direction: row;
    padding-inline: 2rem;
  }

  h1 {
    font-weight: 800;
    font-size: 2.2rem;
  }
`

const StyledLogo = styled.img`
  width: 8rem;
  height: auto;
  border-radius: 1rem;
`

const StyledGuildsSection = styled.section`
  background-color: var(--color-gray--700);
  border-radius: 1em;
  padding: 1em;
  margin-inline: 1em;
  text-align: center;

  a {
    color: var(--color-gray--100);

    &:hover {
      text-decoration: none;
      color: var(--color-turquoise--400);
    }
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
  }

  @media (min-width: 48em) {
    padding: 2em;
    text-align: start;
  }

  @media (min-width: 66em) {
    margin-inline: auto;
  }
`

const StyledGuildsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  margin-top: 2rem;
  
  @media (min-width: 26em) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 48em) {
    grid-template-columns: repeat(5, 1fr);
  }
`

const StyledGuildLink = styled(Link)`
  text-decoration: none;
  text-align: center;

  @media (min-width: 48em) {
    font-size: .85rem;
  }

  &:hover img {
    border-color: var(--color-turquoise--400);
  }

  img {
    background-color: var(--color-gray--900);
    width: 100%;
    border: .125rem solid var(--color-gray--700);
    border-radius: .5rem;
    margin-block-end: .5em;
  }
`
