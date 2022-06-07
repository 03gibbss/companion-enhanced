import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import { Creator } from './components/views/creator/Index';
import { ButtonTest } from './components/views/buttonTest/Index';
import { CreatorIPs } from './components/views/creatorIPs/Index';
import { MasterConfig } from './components/views/masterConfig/Index';
import { EndpointConfig } from './components/views/endpointConfig/Index';
import { SpecialButtons } from './components/views/specialButtons/Index';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Companion Enhanced!</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/creator">Creator Streamdeck Config</Nav.Link>
            <Nav.Link as={Link} to="/button-test">Button Test</Nav.Link>
            <Nav.Link as={Link} to="/creator-ips">Creator IPs</Nav.Link>
            <Nav.Link as={Link} to="/companion-config">Companion Config</Nav.Link>
            <Nav.Link as={Link} to="/endpoint-config">Endpoint Config</Nav.Link>
            <Nav.Link as={Link} to="/special-buttons">Special Buttons</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Switch>
          <Route path="/creator">
            <Creator />
          </Route>
          <Route path="/button-test">
            <ButtonTest />
          </Route>
          <Route path="/creator-ips">
            <CreatorIPs />
          </Route>
          <Route path="/companion-config">
            <MasterConfig />
          </Route>
          <Route path="/endpoint-config">
            <EndpointConfig />
          </Route>
          <Route path="/special-buttons">
            <SpecialButtons />
          </Route>
          <Route path="/">
            <div>Websocket state WILL go here!</div>
          </Route>
        </Switch>
      </Container>
    </ Router >
  );
}

export default App;
