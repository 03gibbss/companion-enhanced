import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Table from 'react-bootstrap/Table'

export const MasterConfig = () => {

  const [endpointConfig, setEndpointConfig] = useState({ commands: [], feedbacks: [] });
  const [masterConfig, setMasterConfig] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const res = await axios.get('http://localhost:5000/api/v1/masterStreamdeckConfig');
    setMasterConfig(res.data.data);
    const res2 = await axios.get('http://localhost:5000/api/v1/endpointConfig');
    setEndpointConfig(res2.data.data);
    setLoading(false);
  }, [])

  return (
    <>
      <h1>Companion Config</h1>
      {loading ? <div>Loading...</div> :
        <>
          <div>Add this to manually add these triggers to companion buttons for updating the values stored in this app</div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Command</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>/changeUser/:page/:button</td>
                <td>CHANGE USER</td>
                <td>CYCLE</td>
              </tr>
              {endpointConfig.commands.map(item => {
                console.log(item);
                return (
                  <tr>
                    <td>/studio/{item.endpoint}</td>
                    <td>{item.command}</td>
                    <td>{item.type}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </>
      }
      <div>Use this to manually configure the page / button commands in companion to run the commands for actually triggering the actions</div>
      {loading ? <div>Loading...</div> :
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Page</th>
              <th>Button</th>
              <th>Creator</th>
              <th>Command</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {masterConfig.map(item => {
              console.log(item);
              return (
                <tr>
                  <td>{item.page}</td>
                  <td>{item.button}</td>
                  <td>{item.creator}</td>
                  <td>{item.command}</td>
                  <td>{item.option}</td>
                </tr>
              )
            })
            }

          </tbody>
        </Table>
      }
    </>
  )
}