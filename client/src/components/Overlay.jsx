import styled from 'styled-components'

export default function Overlay({ children, onExit }) {
  function handleOnClick(e) {
    if (onExit && e.target == e.currentTarget) {
      e.preventDefault()
      onExit()
    }
  }
  
  return (
    <StyledOverlay onClick={handleOnClick}>
      {children}
    </StyledOverlay>
  )
}

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0,0,0,0.5);
  width: 100vw;
  height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  overflow-y: auto;
  padding-block: 2rem;

  > * {
    width: 90%;
    max-width: 35rem;
  }
`