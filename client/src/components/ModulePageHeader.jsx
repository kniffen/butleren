import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import LoadingBox from  './LoadingBox'
import Toggle from './Toggle'

export default function ModulePageHeader({ title, id, guild }) {
  const [ isEnabled, setIsEnabled ] = useState(false)
  const [ isLocked, setIsLocked ] = useState(true)
  const [ isLoading, setIsLoading ] = useState(true)

  function handleModuleToggle(shouldBeEnabled) {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({isEnabled: shouldBeEnabled})
    }

    return fetch(`/api/modules/${guild}/${id}`, init)
      .then(() => shouldBeEnabled)
      .catch((err) => {
        console.error(err)
        return !shouldBeEnabled
      })
  }

  useEffect(function() {
    setIsLoading(true)
    
    fetch(`/api/modules/${guild}/${id}`)
      .then(res => res.json())
      .then((data) => {
        setIsEnabled(data.isEnabled)
        setIsLocked(data.isLocked)
        setIsLoading(false)
      })
      .catch(console.error)
  }, [guild])

  if (isLoading) return <StyledLoadingBox />

  return (
    <StyledHeader>
      <StyledHeading><Link to={`/modules/${guild}`}>Modules:</Link> {title}</StyledHeading>
      <StyledToggle isDefaultChecked={isEnabled} isLocked={isLocked} onChange={handleModuleToggle}/>
    </StyledHeader>
  )
}

const StyledLoadingBox = styled(LoadingBox)`
  grid-column: span 12;
  height: 3rem;
`

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-column: span 12;
`

const StyledHeading = styled.h2`
  margin: 0;
`

const StyledToggle = styled(Toggle)`
  font-size: 1.2rem;
`