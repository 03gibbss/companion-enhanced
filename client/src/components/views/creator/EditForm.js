import React, { useState, useEffect } from 'react';

import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

export const EditForm = ({ selectedCommand, availableCommands, updateSelectedCommand, updateSelectedType, updateSelectedFeedback, edited, handleSubmit, updateSelectedText }) => {

  const emptyCommand = { type: [], selector: [] };

  const [matchedCommand, setMatchedCommand] = useState(emptyCommand);

  useEffect(() => {
    setMatchedCommand(emptyCommand);
    Object.keys(availableCommands).forEach(key => {
      if (key === selectedCommand.command) {
        setMatchedCommand(availableCommands[key]);
      }
    })
  }, [availableCommands, selectedCommand])

  const handleTextChange = e => {
    updateSelectedText(e.target.value);
  }

  const handleCommandChange = e => {
    updateSelectedCommand(e.target.value);
  }

  const handleTypeChange = e => {
    updateSelectedType(e.target.value);
  }

  const handleFeedbackChange = e => {
    updateSelectedFeedback(e.target.value);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Button: {selectedCommand.button}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              value={selectedCommand.text ? selectedCommand.text : ""}
              placeholder="Enter button text"
              onChange={handleTextChange}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Command</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" value={selectedCommand.command !== null ? selectedCommand.command : ''} onChange={handleCommandChange}>
              <option value={''}>Select a Command</option>
              {Object.keys(availableCommands).map(key => {
                return <option key={key}>{key}</option>
              })}
            </Form.Control>
          </InputGroup>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Type</InputGroup.Text>
            </InputGroup.Prepend>
            {matchedCommand.type.length > 0 ?
              <Form.Control as="select" value={selectedCommand.type} onChange={handleTypeChange}>
                {matchedCommand.type.map(type => {
                  return <option key={type}>{type}</option>
                })}
              </Form.Control>
              :
              <></>}
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Feedback</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" value={selectedCommand.feedback !== null ? selectedCommand.feedback : ''} onChange={handleFeedbackChange}>
              <option value={''}>Select a Feedback Command</option>
              {Object.keys(availableCommands).map(key => {
                return <option key={key}>{key}</option>
              })}
            </Form.Control>
          </InputGroup>
        </Col>
      </Form.Row>
      <Form.Row>
        {edited ?
          <Button
            variant="warning"
            block
            type="submit"
          >Save Changes</Button>
          : <></>
        }
      </Form.Row>
    </Form>
  )
}