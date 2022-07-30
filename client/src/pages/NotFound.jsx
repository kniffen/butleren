import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

export default function NotFound() {
  return (
    <StyledMain>
      <h1 className="not-found__title">Not found</h1>
      <p className="not-found__description">We were unable to find what you were looking for.</p>
      <Link to="/">Back to the dashboard</Link>
    </StyledMain>
  )
}

const className = 'not-found'
const StyledMain = styled.main.attrs(() => ({className}))`
  width: 100vw;
  height: 100vh;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .${className}__title {
    text-transform: uppercase;
    margin: 0;
  }
`