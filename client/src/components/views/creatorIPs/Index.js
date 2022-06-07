import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

export const CreatorIPs = () => {

  const [userIPs, setUserIPs] = useState({})
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [connections, setConnections] = useState({})

  useEffect(async () => {
    const res = await axios.get('http://localhost:5000/api/v1/userIPs');
    setUserIPs(res.data.data);
    const res2 = await axios.get('http://localhost:5000/api/v1/showConnections')
    setConnections(res2.data.data)
    setLoading(false);
  }, [])

  const sendText = (user) => {
    axios.get(`http://localhost:5000/api/v1/sendText/${user}`)
  }

  const handleChange = (user, IP) => {
    const obj = { ...userIPs };
    obj[user] = IP;
    setUserIPs(obj);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(userIPs);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const newUserIPs = userIPs;

    try {
      const res = await axios.post('http://localhost:5000/api/v1/userIPs', newUserIPs, config);
      setSent(true);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Creator IPs</h1>
      {sent ? <div>IPs Updated!</div> :
        <></>
      }
      {loading || sent
        ? <></>
        :
        <>
          <ul>
            {Object.keys(connections).map(key => (
              <li>{key} - {connections[key] ? <> 'Connected' <Button onClick={() => sendText(key)}>
                Update Button Text
        </Button> </> : 'NOT CONNECTED'}</li>
            ))}
          </ul>
          {Object.keys(userIPs).map(key => (
            <Form.Row key={key}>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>{key}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control as="input" value={userIPs[key]} onChange={e => handleChange(key, e.target.value)}>
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