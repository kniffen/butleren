import styled from 'styled-components'

export default function Box({ title, description, children }) {
  return (
    <StyledBox>
      {title && <StyledH5>{title}</StyledH5>}
      {description && <StyledParagraph>{description}</StyledParagraph>}
      {children}
    </StyledBox>
  )
}

const StyledBox = styled.div`
  position: relative;
  background-color: var(--color-gray--800);
  padding: 1em;
  grid-column: span 12;
  border-radius: .5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;

  @media (min-width: 48em) {
    grid-column: span 6;
  }
`

const StyledH5 = styled.h5`
  color: var(--color-gray--100);
  font-weight: 500;
  font-size: 1rem;
  margin: 0;
`

const StyledParagraph = styled.p`
  flex-grow: 1;
  font-size: .85rem;
`