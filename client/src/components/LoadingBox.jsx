import styled, { keyframes } from 'styled-components'

export default function LoadingBox({ className, width, height }) {
  return (
    <StyledDiv {...{className, width, height}} />
  )
}

const BackgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const StyledDiv = styled.div`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};
  border-radius: 1rem;
  background-color: var(--color-gray--600);
  background: linear-gradient(90deg, var(--color-gray--700), var(--color-gray--600));
  background-size: 400% 400%;
  animation: ${BackgroundAnimation} 2s ease infinite;
`