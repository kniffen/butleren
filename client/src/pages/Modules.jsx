import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Context } from '../Store'

import DashboardLayout from '../layouts/Dashboard'

import LoadingBox from '../components/LoadingBox'
import ModuleBox from '../components/ModuleBox'

export default function Modules() {
  const { guild } = useContext(Context)
  const [ modules, setModules ] = useState([])

  useEffect(function() {
    if (!guild) return

    fetch(`/api/modules/${guild.id}`)
      .then(res => res.json())
      .then(setModules)
      .catch(console.error)
  }, [guild])

  if (modules.length <= 0) return (
    <DashboardLayout>
      {[...Array(10)].map((value, i) => <StyledLoadingModuleBox key={i} height="15rem" />)}
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Modules">
      {modules.map(mod => <ModuleBox
        key={mod.id}
        guild={guild}
        {...mod}
        hasSettings={['spotify', 'twitter', 'youtube', 'twitch'].includes(mod.id)}
      />)}
    </DashboardLayout>
  )
}

const StyledLoadingModuleBox = styled(LoadingBox)`
  grid-column: span 12;
  height: 10rem;

  @media (min-width: 48em) {
    grid-column: span 6;
  }
`