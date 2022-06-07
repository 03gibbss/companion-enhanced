import React from 'react';

import Button from 'react-bootstrap/Button'

export const Item = ({ arrKey, value, handleButtonChange, button }) => {

  return (
    <tr key={arrKey}>
      <td>
        <Button
          variant={value.button === button ? 'primary' : 'dark'}
          onClick={(() => { handleButtonChange(value.button) })}
        >{value.button}</Button>
      </td>
      <td>{value.text}</td>
      <td>{value.command}</td>
      <td>{value.type}</td>
      <td>{value.feedback}</td>
    </tr>
  )
}