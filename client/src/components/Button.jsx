import styled, { css } from 'styled-components'

export default function Button({ type, value, onClick, isLoading }) {
  switch (type) {
    case 'submit':
      return (
        <StyledSubmitButton onClick={onClick} value={value} isLoading={isLoading} />
      )

    default:
      return (
        <StyledButton onClick={onClick} isLoading={isLoading}>{value}</StyledButton>
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

const StyledSubmitButton = styled.input.attrs({ type: 'submit' })`
  ${buttonStyles}
  background-color: var(--color-turquoise--400)
`