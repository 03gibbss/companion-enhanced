import React, { useContext, useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import { CreatorContext } from '../../../context/creator/creatorState';

import { Item } from './Item';
import { EditForm } from './EditForm';

export const Streamdeck = () => {

  const [page, setPage] = useState(1);
  const [button, setButton] = useState(1);

  const [visibleConfig, setVisibleConfig] = useState({});

  const [selectedCommand, setSelectedCommand] = useState({});

  const [edited, setEdited] = useState(false);

  const { availableCommands, streamdeckConfig, assignCommand } = useContext(CreatorContext);

  useEffect(() => {
    filterVisible(page);
  }, [streamdeckConfig])

  const filterVisible = (value) => {
    let obj = {};
    Object.keys(streamdeckConfig).forEach(key => {
      if (streamdeckConfig[key].page === value) {
        obj[key] = streamdeckConfig[key];
      }
    })
    setVisibleConfig(obj);
  }

  const handlePageChange = (value) => {
    console.log(value);
    setPage(Number(value));
    filterVisible(Number(value));
    handleChangeSelected(Number(value), button);
  }

  const handleButtonChange = (value) => {
    console.log(value);
    setButton(Number(value))
    handleChangeSelected(page, Number(value));
  }

  const updateSelectedText = text => {
    let obj = { ...selectedCommand };
    if (text === '') {
      text = null;
    }
    obj.text = text;
    console.log(text);
    setSelectedCommand(obj);
    setEdited(true);
  }

  const updateSelectedCommand = command => {
    let obj = { ...selectedCommand };
    if (command === '') {
      command = null;
    }
    obj.command = command;
    obj.type = null;
    Object.keys(availableCommands).forEach(key => {
      if (key === command) {
        obj.type = availableCommands[key].type[0];
      }
    })
    setSelectedCommand(obj);
    setEdited(true);
  }

  const updateSelectedType = type => {
    let obj = { ...selectedCommand };
    obj.type = type;
    setSelectedCommand(obj);
    setEdited(true);
  }

  const updateSelectedFeedback = feedback => {
    let obj = { ...selectedCommand };
    if (feedback === '') {
      feedback = null;
    }
    obj.feedback = feedback;
    setSelectedCommand(obj);
    setEdited(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setEdited(false);
    assignCommand(selectedCommand);
  }

  const handleChangeSelected = (pageValue, buttonValue) => {
    let obj = { page: pageValue, button: buttonValue, command: null, type: null, feedback: null };
    if (pageValue !== null & buttonValue !== null) {
      Object.keys(streamdeckConfig).forEach(key => {
        if (streamdeckConfig[key].page === pageValue && streamdeckConfig[key].button === buttonValue) {
          obj = streamdeckConfig[key];
          console.log(streamdeckConfig[key])
        }
      })
    }
    setSelectedCommand(obj);
    setEdited(false);
  }

  useEffect(() => filterVisible(page), [streamdeckConfig])
  useEffect(() => handleChangeSelected(page, button), [streamdeckConfig])

  return (
    <>
      <h1>Creator Streamdeck Configuration</h1>

      <div className="btn-group d-flex" role="group">
        <Button variant="secondary">Page: </Button>
        {[1, 2, 3, 4, 5].map(number => (
          <Button
            key={number}
            type="button"
            variant={page === number ? 'primary' : 'dark'}
            className="btn btn-default w-100"
            onClick={(e) => handlePageChange(number)}
          >
            {number}
          </Button>
        ))}
      </div>

      <br></br>

      <EditForm selectedCommand={selectedCommand} availableCommands={availableCommands} updateSelectedCommand={updateSelectedCommand} updateSelectedType={updateSelectedType} updateSelectedFeedback={updateSelectedFeedback} edited={edited} handleSubmit={handleSubmit} updateSelectedText={updateSelectedText} />

      <br></br>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th width={'10%'}>Button</th>
            <th width={'25%'}>Button Text</th>
            <th width={'25%'}>Command</th>
            <th width={'15%'}>Type</th>
            <th width={'25%'}>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(visibleConfig).map(key => {
            const value = visibleConfig[key];
            return <Item key={key} arrKey={key} value={value} availableCommands={availableCommands} handleButtonChange={handleButtonChange} button={button} />
          })}
        </tbody>
      </Table>
    </>
  )
}