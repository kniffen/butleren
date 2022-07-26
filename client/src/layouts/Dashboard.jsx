import { useContext } from 'react'
import styled from 'styled-components'

import { Context } from '../Store'

import Sidebar from '../sections/Sidebar'
import PageHeader from '../components/PageHeader'

export default function Dashboard({ children, title }) {
  const { guild } = useContext(Context)

  return (
    <>
      <Sidebar />
      <StyledDashboard>
        <PageHeader guild={guild} />
        {title && <StyledHeading>{title}</StyledHeading>}
        {children}
      </StyledDashboard>
    </>
  )
}

const StyledDashboard = styled.div`
  margin-block: 2rem;
  margin-inline: 5rem 1rem;
  padding-inline: calc((100% - 75rem) / 2);
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 100%));
  gap: 1rem;

  @media (min-width: 64em) {
    margin-inline: 18rem 2rem;
  }
`

const StyledHeading = styled.h2`
  font-size: 2rem;
  grid-column: span 12;
`
