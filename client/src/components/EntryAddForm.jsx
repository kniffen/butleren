import { useState } from 'react'
import styled from 'styled-components'

import Box from './Box'
import Button from './Button'

export default function EntryAddForm({ className, title, uri, fields, onSuccess, onFailure, onError }) {
  const [ searchResults, setSearchResults ] = useState([])
  const [ selectedSearchResult, setSelectedSearchResult ] = useState(null)
  const searchField = fields.find(field => field.hasOwnProperty('search'))

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const formData = new FormData(e.target)
      if ('' === formData.get('id')) return
      
      const body = new URLSearchParams(formData)
      const init = {method: 'POST', body}
      const res  = await fetch(uri, init)

      res.ok ? onSuccess(res) : onFailure(res)

    } catch(err) {
      onError(err)
    }
  }

  async function handleSearch(e) {
    e.preventDefault()

    try {
      const formData  = new FormData(e.target)
      const body      = new URLSearchParams(formData)
      const searchURI = searchField.search.generateURI(body.get('query'))
      const results   = searchField.search.parseResults(await fetch(searchURI).then(res => res.json()))

      setSearchResults(results)
      setSelectedSearchResult(results[0])
    
    } catch(err) { console.error(err) }
  }

  return (
    <Box className={className} title={title}>
      {searchField && <>
        <StyledSearchForm onSubmit={handleSearch}>
          <label>
            Find
            <input type="text" name="query" defaultValue="" required />
          </label>
          <input type="submit" value="Search" />
        </StyledSearchForm>
        <StyledSearchResults>
          {searchResults.map(result =>
            <div 
              className={`search-results__option${result.id == selectedSearchResult.id ? ' search-results__option--selected' : ''}`}
              key={result.id}
              onClick={() => setSelectedSearchResult(result)}
            >
              <img className="search-results__option__img" src={result.image} />
              <p className="search-results__option__name">{result.name}</p>
            </div>
          )}
        </StyledSearchResults>
        <hr/>
      </>}
      
      <StyledForm onSubmit={handleSubmit}>
        {fields.map(field => {
          switch (field.type) {
            case 'select':
              return <label key={field.name}>
                {field.title}
                <select name={field.name} defaultValue={field.value || ''} required={field.isRequired}>
                  {field.options.map(option => <option key={option.id} value={option.id}>{option.value}</option>)}
                </select>
              </label>

            default:
              return <label key={field.name}>
                {field.title}
                <input
                  type="text"
                  name={field.name}
                  defaultValue={field.search ? selectedSearchResult?.id : 'name' === field.name ? selectedSearchResult?.name : field.value}
                  required={field.isRequired}
                  readOnly={field.isReadOnly}
                  hidden={field.isHidden}
                />
              </label>
          }
        })}

        <Button type="submit" value="Add"/>
      </StyledForm>
    </Box>
  )
}

const searchFormClassName = 'search-entry-form'
const StyledSearchForm = styled.form.attrs(() => ({className: searchFormClassName}))`
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 1em;
`

const searchResultsClassName = 'search-results'
const StyledSearchResults = styled.div.attrs(() => ({className: searchResultsClassName}))`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  margin-block-start: 1em;
  width: 100%;

  @media (min-width: 26em) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 48em) {
    min-height: 7em;
  }

  .${searchResultsClassName}__option {
    text-align: center;
    
    &__img {
      width: 100%;
      border-radius: .5em;
      border: .128em solid var(--color-gray--800);
      cursor: pointer;

      &:hover {
        border-color: var(--color-gray--400);  
      }
    }

    &__name {
      font-size: .75rem;
    }

    &--selected .${searchResultsClassName}__option__img {
      border-color: var(--color-turquoise--400);
    }
  }
`

const className = 'add-entry-form'
const StyledForm = styled.form.attrs(() => ({className}))`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: flex-start;
`