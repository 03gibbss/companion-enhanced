import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

export const EndpointConfig = () => {

  const [endpointConfig, setEndpointConfig] = useState({ commands: [], feedbacks: [] });
  const [creatorStreamdeckConfig, setCreatorStreamdeckConfig] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCommand, setSelectedCommand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentEndpoint, setCurrentEndpoint] = useState('');

  const [selectedFeedback, setSelectedFeedback] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  const [currentButton, setCurrentButton] = useState('');

  const [unusedCommands, setUnusedCommands] = useState([]);
  const [unusedFeedback, setUnusedFeedback] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get('http://localhost:5000/api/v1/endpointConfig');
      const res2 = await axios.get('http://localhost:5000/api/v1/creatorStreamdeckConfig')

      setEndpointConfig(res.data.data);
      setCreatorStreamdeckConfig(res2.data.data);
    })()

  }, [])

  useEffect(() => {

    const creatorConfig = [...creatorStreamdeckConfig];

    const endpointCommands = [...endpointConfig.commands]
    const endpointFeedbacks = [...endpointConfig.feedbacks]

    let filteredCommands = creatorConfig.filter(({ command, type }) => command !== null || type !== null);

    let filteredFeedback = creatorConfig.filter(({ feedback }) => feedback !== null)

    let unassignedCommands = [];

    filteredCommands.forEach(a => {
      let match = false;
      endpointCommands.forEach(e => {
        if (a.command === e.command && a.type === e.type) {
          match = true;
        }
      })
      if (!match) {
        unassignedCommands.push({ command: a.command, type: a.type });
      }
    })

    let unassignedFeedback = [];

    filteredFeedback.forEach(a => {
      let match = false;
      endpointFeedbacks.forEach(e => {
        if (a.feedback === e.feedback) {
          match = true;
        }
      })
      if (!match) {
        unassignedFeedback.push(a.feedback);
      }
    })

    setUnusedCommands(unassignedCommands);
    setUnusedFeedback(unassignedFeedback);

    setLoading(false);
  }, [endpointConfig, creatorStreamdeckConfig])

  const selectCommand = (command, type) => {
    console.log(command, type);
    setCurrentEndpoint('');
    setSelectedCommand(command);
    setSelectedType(type);
  }

  const selectFeedback = (feedback) => {
    console.log(feedback);
    setCurrentPage('');
    setCurrentButton('');
    setSelectedFeedback(feedback);
  }

  // const handleChange = (user, IP) => {
  //   const obj = { ...userIPs };
  //   obj[user] = IP;
  //   setUserIPs(obj);
  // }

  const handleCommandSubmit = async (e) => {
    e.preventDefault();

    if (currentEndpoint === '' || selectedCommand === '' || selectedType === '') {
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const newEndpoint = {
      endpoint: currentEndpoint, command: selectedCommand, type: selectedType
    }

    try {
      const res = await axios.post('http://localhost:5000/api/v1/endpointCommand', newEndpoint, config);

      console.log(res.data.data);

      let obj = { ...endpointConfig };

      obj.commands.push(res.data.data);

      setEndpointConfig(obj);

      setCurrentEndpoint('');
      setSelectedCommand('');
      setSelectedType('');
    } catch (error) {
      console.log(error);
    }
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (selectedFeedback === '' || currentPage === '' || currentButton === '') {
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const newFeedback = {
      feedback: selectedFeedback,
      page: Number(currentPage),
      button: Number(currentButton)
    }

    console.log(newFeedback);

    try {
      const res = await axios.post('http://localhost:5000/api/v1/endpointFeedback', newFeedback, config);

      let obj = { ...endpointConfig };

      obj.feedbacks.push(res.data.data);

      setEndpointConfig(obj);

      setSelectedFeedback('');
      setCurrentPage('');
      setCurrentButton('');

    } catch (error) {
      console.log(error);
    }
  }

  const deleteFeedback = async obj => {
    const { feedback, page, button } = obj;

    const toDelete = { feedback, page: Number(page), button: Number(button) };

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('http://localhost:5000/api/v1/endpointFeedback/delete', toDelete, config);

      const { feedback: delFeedback, page: delPage, button: delButton } = res.data.data;


      let arr = endpointConfig.feedbacks.filter(item => item.feedback !== delFeedback || item.page !== delPage || item.button !== delButton);

      let existingConfig = { ...endpointConfig };

      existingConfig.feedbacks = arr;

      setEndpointConfig(existingConfig);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteCommand = async obj => {
    const { endpoint, command, type } = obj;

    const toDelete = { endpoint, command, type };

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('http://localhost:5000/api/v1/endpointCommand/delete', toDelete, config);

      const { endpoint: delEndpoint, command: delCommand, type: delType } = res.data.data;

      let arr = endpointConfig.commands.filter(item => item.endpoint !== delEndpoint || item.command !== delCommand || item.type !== delType);

      console.log(delEndpoint, delCommand, delType)
      console.log(arr);

      let existingConfig = { ...endpointConfig };

      existingConfig.commands = arr;

      setEndpointConfig(existingConfig);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <h1>Endpoint Config</h1>
      {loading
        ? <></>
        :
        <>
          <h3>Assigned Endpoints</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Command</th>
                <th>Type</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {endpointConfig.commands.map((obj, index) => (
                <tr key={index}>
                  <td>{obj.endpoint}</td>
                  <td>{obj.command}</td>
                  <td>{obj.type}</td>
                  <td><Button
                    variant="danger"
                    onClick={() => deleteCommand(obj)}
                  >
                    Delete
                      </Button></td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h3>Assigned Feedbacks</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th width="25%">Feedback</th>
                <th width="25%">Page</th>
                <th width="25%">Button</th>
                <th width="25%">Delete</th>
              </tr>
            </thead>
            <tbody>
              {endpointConfig.feedbacks.map((obj, index) => (
                <tr key={index}>
                  <td>{obj.feedback}</td>
                  <td>{obj.page}</td>
                  <td>{obj.button}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteFeedback(obj)}
                    >
                      Delete
                      </Button>
                    {' '}
                    <Button
                      onClick={() => selectFeedback(obj.feedback)}
                    >
                      Add Additional
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h3>Unassigned Endpoints</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Command</th>
                <th>Type</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {unusedCommands.map((obj, index) => {
                return (
                  <tr key={index}>
                    <td>{obj.command}</td>
                    <td>{obj.type}</td>
                    <td>
                      <Button
                        onClick={() => selectCommand(obj.command, obj.type)}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>

          <h3>Unassigned Feedback</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Feedback</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {unusedFeedback.map((feedback, index) => {
                return (
                  <tr key={index}>
                    <td>{feedback}</td>
                    <td>
                      <Button
                        onClick={() => selectFeedback(feedback)}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </>
      }
      <h3>Edit Endpoint</h3>
      <Form onSubmit={handleCommandSubmit}>
        <Form.Row>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>{selectedCommand} // {selectedType} | Endpoint:</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control as="input" value={currentEndpoint} onChange={e => setCurrentEndpoint(e.target.value)} />
              <InputGroup.Append>
                <Button type="submit" variant="outline-primary">Save</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Row>
      </Form >
      <br></br>
      <h3>Edit Feedback</h3>
      <Form onSubmit={handleFeedbackSubmit}>
        <Form.Row>
          <Col>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>{selectedFeedback} | Page: </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control as="input" value={currentPage} onChange={e => setCurrentPage(e.target.value)} />
              <InputGroup.Prepend>
                <InputGroup.Text>Button: </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control as="input" value={currentButton} onChange={e => setCurrentButton(e.target.value)} />
              <InputGroup.Append>
                <Button type="submit" variant="outline-primary">Save</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Row>
      </Form >
    </>
  )
}