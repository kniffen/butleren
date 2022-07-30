import { useState, useContext } from 'react'
import styled from 'styled-components'

import { Context } from '../Store'

import Overlay from './Overlay'
import Box from './Box'
import EntryAddForm from './EntryAddForm'
import EntryEditForm from './EntryEditForm'
import Button from './Button'

export default function Entries({ className, title, uri, entries, fields, onUpdate }) {
  const { notificationsDispatch } = useContext(Context)
  const [ isAddingEntry, setIsAddingEntry ] = useState(false)
  const [ entryBeingEdited, setEntryBeingEdited ] = useState(null)

  async function handleDeleteEntry(id) {
    try {
      const init = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
      }
      
      const res = await fetch(uri, init)

      notificationsDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          title:       res.ok ? 'Success!' : 'Error!',
          description: res.ok ? 'Entry deleted' : `${res.status} ${res.statusText}`,
          type:        res.ok ? 'SUCCESS' : 'ERROR'
        }
      })

      if (res.ok) onUpdate()

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <StyledEntriesBox title={title} className={className}>
      <ul className="entries__list">
        {entries.map(entry => <li className="entries__entry" key={entry.id}>
          <span className="entries__entry__name">{entry.name}</span>
          <Button className="entries__entry__btn" value="Edit" onClick={() => setEntryBeingEdited(entry)} />
          <Button className="entries__entry__btn entries__entry__btn--delete" value="Delete" onClick={() => handleDeleteEntry(entry.id)} />
        </li>)}
      </ul>

      <StyledAddButton value="Add new" onClick={() => setIsAddingEntry(true)} />

      {(isAddingEntry || entryBeingEdited) && <Overlay
        onExit={() => {
          setIsAddingEntry(false)
          setEntryBeingEdited(null)
        }}
      >
        {isAddingEntry && <EntryAddForm
          title="Add entry"
          uri={uri}
          fields={fields}
          onSuccess={(res) => {
            setIsAddingEntry(false)
            onUpdate()
            notificationsDispatch({
              type: 'ADD_NOTIFICATION',
              payload: {title: 'Success!', description: 'New entry added', type: 'SUCCESS'}
            })
          }}
          onFailure={(res) => {
            notificationsDispatch({
              type: 'ADD_NOTIFICATION',
              payload: {title: 'Failure!', description: `${res.status} ${res.statusText}`, type: 'ERROR'}
            })
          }}
          onError={(err) => {
            notificationsDispatch({
              type: 'ADD_NOTIFICATION',
              payload: {title: 'Error!', description: err.message || '', type: 'ERROR'}
            })
          }}
        />}

        {entryBeingEdited && <EntryEditForm
          title="Edit entry"
          uri={uri}
          entry={entryBeingEdited}
          fields={fields}
          onSuccess={(res) => {
            setEntryBeingEdited(null)
            onUpdate()
            notificationsDispatch({
              type: 'ADD_NOTIFICATION',
              payload: {title: 'Success!', description: 'Entry updated', type: 'SUCCESS'}
            })
          }}
          onFailure={(res) => {
            notificationsDispatch({
              type: 'ADD_NOTIFICATION',
              payload: {title: 'Failure!', description: `${res.status} ${res.statusText}`, type: 'ERROR'}
            })
          }}
          onError={(err) => {
            notificationsDispatch({
              type: 'ADD_NOTIFICATION',
              payload: {title: 'Error!', description: err.message || '', type: 'ERROR'}
            })
          }}
        />}
      </Overlay>}
    </StyledEntriesBox>
  )
}

const className = 'entries'
const StyledEntriesBox = styled(Box).attrs(() => ({className}))`
  font-size: .9rem;
  gap: 2em;

  .${className}__list {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    gap: .5em;
  }

  .${className}__entry {
    display: flex;
    flex-wrap: wrap;
    gap: .5em 1em;
    align-items: center;
    padding: .5em 1em;
    width: calc(100% + 2em);
    margin-inline-start: -1em;
    border-radius: .25em;

    @media (min-width: 35em) {
      flex-wrap: nowrap;
    }
    
    &:hover {
      background-color: var(--color-gray--600);
    }
    
    &__name {
      width: 100%;
      flex-grow: 1;
    }

    &__btn {
      font-size: .85rem;
      flex-shrink: 0;
      font-weight: 600;
      
      &--delete {
        background-color: var(--color-red--400);
        color: var(--color-gray--100);
      }
    }
  }
`

const StyledAddButton = styled(Button)`
  background-color: var(--color-turquoise--400);
  color: var(--color-gray--900);
`