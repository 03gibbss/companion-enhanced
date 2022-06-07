import React, { useState } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'


export const ButtonTest = () => {

  const [user, setUser] = useState(1);
  const [page, setPage] = useState(1);
  const [button, setButton] = useState(1);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(user, page, button);

    axios.get(`http://localhost:5000/${user}/${page}/${button}`)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Button Test</h1>
      <Form.Row>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>User</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" value={user} onChange={e => setUser(Number(e.target.value))}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </Form.Control>
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Page</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" value={page} onChange={e => setPage(Number(e.target.value))}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Button</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" value={button} onChange={e => setButton(Number(e.target.value))}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
              <option>13</option>
              <option>17</option>
              <option>18</option>
              <option>19</option>
              <option>20</option>
              <option>21</option>
            </Form.Control>
          </InputGroup>
        </Col>
      </Form.Row>
      <br></br>
      <Form.Row>
        <Button block type="submit">
          Press!
        </Button>
      </Form.Row>
    </Form>
  )
}