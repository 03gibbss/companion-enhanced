import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

export const SpecialButtons = () => {

  const [buttons, setButtons] = useState({})
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(async () => {
    const res = await axios.get('http://localhost:5000/api/v1/specialPressButtonConfig');
    console.log(res.data.data);
    setButtons(res.data.data);
    setLoading(false);
  }, [])

  const handleChange = (user, page, button) => {
    const obj = { ...buttons };
    obj[user] = { page, button };
    setButtons(obj);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(buttons);

    const obj = { ...buttons }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('http://localhost:5000/api/v1/specialPressButtonConfig', obj, config);
      setSent(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Special Buttons</h1>
      {sent ? <div>Buttons Updated!</div> :
        <></>
      }
      {loading || sent
        ? <></>
        :
        <>
          {Object.keys(buttons).map(key => (
            <Form.Row key={key}>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>{key}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Page</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control as="input" value={buttons[key].page} onChange={e => handleChange(key, e.target.value, buttons[key].button)}></Form.Control>
                  <Form.Control as="input" value={buttons[key].button} onChange={e => handleChange(key, buttons[key].page, e.target.value)}>
                  </Form.Control>
                </InputGroup>
              </Col>
            </Form.Row>
          ))}
          <br></br>
          <Form.Row>
            <Button block type="submit">
              Save
        </Button>
          </Form.Row>
        </>
      }
    </Form >
  )
}