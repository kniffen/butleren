import { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { Context } from '../Store.jsx'

export default function Notifications() {
  const { notifications } = useContext(Context)

  return (
    <StyledNotifications>
      {notifications.map(notification => <Notification {...notification}/>)}
    </StyledNotifications>
  )
}

function Notification({ id, title, description, type }) {
  const { notificationsDispatch } = useContext(Context)

  useEffect(function() {
    setTimeout(() => {
      notificationsDispatch({type: 'REMOVE_NOTIFICATION', id})
    }, 5000)
  }, [])

  return (
    <StyledNotification isError={'ERROR' === type}>
      <h6 className="notification__title">{title}</h6>
      <p className="notification__description">{description}</p>
    </StyledNotification>
  )
}

const styledNotificationsClassName = 'notifications'
const StyledNotifications = styled.div.attrs(() => ({className: styledNotificationsClassName}))`
  position: fixed;
  inset-block-end: 1rem;
  inset-inline-end: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1em;
`

const styledNotificationClassName = 'notification'
const StyledNotification = styled.div.attrs(() => ({className: styledNotificationClassName}))`
  background-color: ${(props) => props.isError ? 'var(--color-red--400)' : 'var(--color-turquoise--400)'};
  padding: 1rem;
  border-radius: 0.158rem;
  overflow: hidden;
  width: 18rem;
  animation: slideIn .5s;
  animation-fill-mode: forwards;
  transition: .5s ease-in-out;

  > * {
    color: ${(props) => props.isError ? 'var(--color-gray--100)' : 'var(--color-gray--900)'};
  }

  .${styledNotificationClassName}__title {
    text-transform: uppercase;
    margin-block: 0 1em;
  }

  .${styledNotificationClassName}__description {
    margin: 0
  }
`