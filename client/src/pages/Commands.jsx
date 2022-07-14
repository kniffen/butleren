import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Context } from '../Store'

import DashboardLayout from '../layouts/Dashboard'

import LoadingBox from '../components/LoadingBox'
import CommandBox from '../components/CommandBox'
import Button from '../components/Button'

export default function Commands() {
  const { guild } = useContext(Context)
  const [ selectedModule, setSelectedModule ] = useState(null)
  const [ modules, setModules ] = useState([])
  const [ commands, setCommands ] = useState([])

  useEffect(function() {
    if (!guild) return

    fetch(`/api/commands/${guild.id}`)
      .then(res => res.json())
      .then((commands) => {
        setModules(commands.reduce((modules, command) => 
          (modules.find(mod => mod.id === command.module.id) ? modules : [...modules, command.module]),
        []))

        if (!selectedModule)
          setSelectedModule(modules[0])

        setCommands(commands)        
      })
      .catch(console.error)
  }, [guild])

  if (commands.length <= 0) return (
    <DashboardLayout>
      <StyledModuleButtonsContainer>
        {[...Array(6)].map((value, i) => <StyledLoadingCommandBox key={i} width="4rem" height="2rem" />)}
      </StyledModuleButtonsContainer>
      {[...Array(18)].map((value, i) => <StyledLoadingCommandBox key={i} height="5rem" />)}
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <StyledModuleButtonsContainer>
        {modules.map(mod => <StyledModuleButton key={mod.id} value={mod.name}/>)}
      </StyledModuleButtonsContainer>
      {commands
        .filter(command => selectedModule && command.module.id === selectedModule.id)
        .map(command => <CommandBox key={command.id} guild={guild} {...command}/>)
      }
    </DashboardLayout>
  )
}

const StyledLoadingCommandBox = styled(LoadingBox)`
  grid-column: span 12;
  
  @media (min-width: 48em) {
    grid-column: span 6;
  }

  @media (min-width: 64em) {
    grid-column: span 4;
  }
`

const StyledModuleButtonsContainer = styled.div`
  grid-column: span 12;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
`

const StyledModuleButton = styled(Button)`

`