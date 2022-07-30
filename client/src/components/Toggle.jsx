import { useState } from 'react'
import styled from 'styled-components'

export default function Toggle({ className, isDefaultChecked, isLocked, onChange }) {
  const [ isChecking, setIsChecking ] = useState(false)
  const [ isChecked, setIsChecked ] = useState(isDefaultChecked)

  function handleCheckboxClick(e) {
    if(isLocked) return
    
    setIsChecking(true)
    
    onChange(!isChecked)
      .then(setIsChecked)
      .finally(() => setIsChecking(false))
  }

  return (
    <StyledLabel {...{className, isChecked, isChecking, isLocked}}>
      <StyledCheckbox onChange={handleCheckboxClick} defaultChecked={isChecked} />
    </StyledLabel>
  )
}

const StyledLabel = styled.label`
  position: relative;
  background-color: var(--color-gray--500);
  width: 2em;
  height: 1em;
  border-radius: .25em;
  font-size: 1rem;
  cursor: pointer;
  
  &::before,
  &::after {
    background-color: var(--color-gray--300);
    position: absolute;
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    border-radius: .25em;
  }

  &::before {
    width: 50%;
    height: 80%;
    inset-block-start: 10%;
    inset-inline: ${props => props.isChecked ? 'auto 5%' : '5% auto'};
    background-color: ${props => props.isChecked ? 'var(--color-turquoise--400)' : 'var(--color-gray--400)'};
  }

  &::after {
    display: ${props => props.isChecking || props.isLocked ? 'block' : 'none'};
    background-color: var(--color-gray--800);
    opacity: .5;
    cursor: ${props => props.isLocked ? 'not-allowed' : 'wait'};
  }
`

const StyledCheckbox = styled.input.attrs({type: 'checkbox'})`
  display: none;
`