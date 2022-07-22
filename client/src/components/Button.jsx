import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

export default function Button({
  className,
  type,
  value,
  onClick,
  isLoading,
  to = '/'
}) {
  switch (type) {
    case 'submit':
      return (
        <StyledSubmitButton className={className} onClick={onClick} value={value} isLoading={isLoading} />
      )
    case 'link':
      return (
        <StyledLink className={className} to={to} isLoading={isLoading}>{value}</StyledLink>  
      )

    default:
      return (
        <StyledButton className={className} onClick={onClick} isLoading={isLoading}>{value}</StyledButton>
      )
  }
}

const buttonStyles = css`
  background-color: var(--color-gray--400);
  color: var(--color-gray--900);
  padding: .5em 1em;
  border: none;
  font-weight: 500;
  border-radius: .25em;
  font-size: 1rem;
  cursor: ${props => props.isLoading ? 'wait' : 'pointer'};
  transition: filter .25s ease-in-out;

  &:hover {
    filter: brightness(110%);
  }
`

const StyledButton = styled.button`
  ${buttonStyles}
`

const StyledLink = styled(Link)`
  ${buttonStyles}

  &:hover {
    text-decoration: none;
  }
`

const StyledSubmitButton = styled.input.attrs({ type: 'submit' })`
  ${buttonStyles}
  background-color: var(--color-turquoise--400)
`