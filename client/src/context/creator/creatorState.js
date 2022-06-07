import React, { createContext, useReducer } from 'react';
import CreatorReducer from './creatorReducer';
import axios from 'axios';

// Initial state
const initialState = {
  availableCommands: {},
  streamdeckConfig: {},
  error: null,
  loadingCommands: true,
  loadingConfig: true,
};


// Create context
export const CreatorContext = createContext(initialState);

// Provider component
export const CreatorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CreatorReducer, initialState);

  // Actions
  async function getAvailableCommands() {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/availableCommands');

      dispatch({
        type: 'GET_AVAILABLE_COMMANDS',
        payload: res.data.data
      });
    } catch (error) {
      dispatch({
        type: 'COMAND_ERROR',
        payload: error.response.data.error
      });
    }
  }

  async function getStreamdeckConfig() {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/creatorStreamdeckConfig');

      dispatch({
        type: 'GET_STREAMDECK_CONFIG',
        payload: res.data.data
      });
    } catch (error) {
      dispatch({
        type: 'COMAND_ERROR',
        payload: error.response.data.error
      });
    }
  }

  async function assignCommand(command) {
    console.log(command);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/creatorStreamdeckConfig/update', command, config);

      console.log(res.data.data);

      dispatch({
        type: 'ASSIGN_COMMAND',
        payload: res.data.data
      });
    } catch (error) {
      dispatch({
        type: 'COMMAND_ERROR',
        payload: error.response.data.error
      });
    }
  }

  return (
    <CreatorContext.Provider
      value={{
        availableCommands: state.availableCommands,
        streamdeckConfig: state.streamdeckConfig,
        error: state.error,
        loading: state.loading,
        getAvailableCommands,
        getStreamdeckConfig,
        assignCommand,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
};
