import styled from 'styled-components'

import Box from './Box'
import Button from './Button'

export default function EntryEditForm({ className, title, uri, entry, fields, onSuccess, onFailure, onError }) {
  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const formData = new FormData(e.target)
      formData.delete('name')

      const body = new URLSearchParams(formData)
      const res  = await fetch(uri, {method: 'PATCH', body})
   
      res.ok ? onSuccess(res) : onFailure(res)
    
    } catch(err) { 
      console.error(err)
      onError(err)
    }
  }
  
  return (
    <Box className={className} title={title}>
      <StyledForm onSubmit={handleSubmit}>
        {fields.map(field => {
          switch (field.type) {
            case 'select':
              return <label key={field.name}>
                {field.title}
                <select name={field.name} defaultValue={entry[field.name] || ''} required={field.isRequired}>
                  {field.options.map(option => <option key={option.id} value={option.id}>{option.value}</option>)}
                </select>
              </label>

            default:
              if (field.isHidden)
                return <input key={field.name} type="text" name={field.name} value={entry[field.name]} required readOnly hidden/>
              
              return <label key={field.name}>
                {field.title}
                <input type="text" name={field.name} defaultValue={entry[field.name]} required={field.isRequired} readOnly={field.isReadOnly}/>
              </label>
          }
        })}

        <Button type="submit" value="Save" />
      </StyledForm>
    </Box>
  )
}

const className = 'edit-entry-form'
const StyledForm = styled.form.attrs(() => ({className}))`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: flex-start;
`