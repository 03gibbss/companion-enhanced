export default (state, action) => {
  switch (action.type) {
    case 'GET_AVAILABLE_COMMANDS':
      return {
        ...state,
        loadingCommands: false,
        availableCommands: action.payload
      };
    case 'GET_STREAMDECK_CONFIG':
      return {
        ...state,
        loadingConfig: false,
        streamdeckConfig: action.payload
      };
    case 'ASSIGN_COMMAND':
      let config = { ...state.streamdeckConfig }
      Object.keys(config).forEach(key => {
        if (config[key].page === action.payload.page && config[key].button === action.payload.button) {
          config[key] = action.payload;
        }
      })
      return {
        ...state,
        streamdeckConfig: { ...config }
      };
    case 'COMMAND_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
