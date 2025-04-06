import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Context } from '../Store.jsx'
import DashboardLayout from '../layouts/Dashboard'
import placeholderImage from '../assets/images/placeholder.png'

export default function Home() {
  const [ guilds, setGuilds ] = useState([])
  const { setGuild } = useContext(Context)

  useEffect(function() {
    setGuild(null);

    fetch('/api/guilds')
      .then(res => res.json())
      .then(setGuilds)
      .catch(console.error);
  }, []);

  return (<DashboardLayout title={"Guilds"}>
    <StyledGuildsSection>
      <p>The bot is connected to {guilds.length} guilds.</p>
      <StyledGuildsContainer>
        {guilds.map(guild => <StyledGuildLink key={guild.id} to={`/guild/${guild.id}`}>
          <img src={guild.iconURL || placeholderImage}></img>
          <p>{guild.name}</p>
        </StyledGuildLink>)}
      </StyledGuildsContainer>
    </StyledGuildsSection>
  </DashboardLayout>);
}

const StyledGuildsSection = styled.section`
  grid-column: span 12;
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
