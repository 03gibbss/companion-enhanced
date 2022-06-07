require('dotenv').config()

const colors = require('colors');
const EventEmitter = require('events');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const DB = require('./libs/DB');

const {
  creators,
  basicCreatorCommands,
  specialCreatorCommands,
  allCreatorCommands,
  availableButtons,
  creatorPages,
  startingPage
} = require('./libs/constants');

const app = express();
app.use(express.json());
app.use(cors());

const system = new EventEmitter();

let store = {
  creatorStreamdeckConfig: {},
  masterStreamdeckConfig: {},
  userIPs: [],
  endpointConfig: [],
  endpointCommands: [],
  endpointFeedbacks: [],
  specialPressButtonConfig: {}
}

let selectedUser = 1;

let state = {
  X32: {
    creators: {
      1: {
        mute: 'UNMUTE',
        mixbus: 0,
        discord: 0,
        game: 0,
        music: 0,
        headset1: 0,
        headset2: 0,
        headset3: 0,
        headset4: 0
      },
      2: {
        mute: 'UNMUTE',
        mixbus: 0,
        discord: 0,
        game: 0,
        music: 0,
        headset1: 0,
        headset2: 0,
        headset3: 0,
        headset4: 0
      },
      3: {
        mute: 'UNMUTE',
        mixbus: 0,
        discord: 0,
        game: 0,
        music: 0,
        headset1: 0,
        headset2: 0,
        headset3: 0,
        headset4: 0
      },
      4: {
        mute: 'UNMUTE',
        mixbus: 0,
        discord: 0,
        game: 0,
        music: 0,
        headset1: 0,
        headset2: 0,
        headset3: 0,
        headset4: 0
      }
    }
  },
  vMix: {
    program: 1
  },
  Videohub: {
    creators: {
      1: {
        monitorFeed: 1
      },
      2: {
        monitorFeed: 2
      },
      3: {
        monitorFeed: 3
      },
      4: {
        monitorFeed: 4
      }
    }
  }
}

const init = async () => {
  const db = new DB(system);

  app.listen(process.env.PORT, () => {
    console.log(colors.yellow.bold(`Server running on port: ${process.env.PORT}`));
  })

  // Attempt to load userIPs from db
  system.emit('db_get', 'userIPs', userIPs => {
    if (userIPs === undefined) {
      store.userIPs = {
        1: '192.168.1.1:8888',
        2: '192.168.1.2:8888',
        3: '192.168.1.3:8888',
        4: '192.168.1.4:8888',
      };

      system.emit('db_set', 'userIPs', store.userIPs)
    } else {
      store.userIPs = userIPs;
    }
  })

  system.emit('db_get', 'specialPressButtonConfig', specialPressButtonConfig => {
    if (specialPressButtonConfig === undefined) {
      store.specialPressButtonConfig = {
        1: { page: 40, button: 2 },
        2: { page: 40, button: 3 },
        3: { page: 40, button: 4 },
        4: { page: 40, button: 5 },
        5: { page: 40, button: 10 },
        6: { page: 40, button: 11 },
        7: { page: 40, button: 12 },
        8: { page: 40, button: 13 },
        9: { page: 40, button: 18 },
        10: { page: 40, button: 19 },
      }

      system.emit('db_set', 'specialPressButtonConfig', store.specialPressButtonConfig)
    } else {
      store.specialPressButtonConfig = specialPressButtonConfig;
    }
  })

  // Attempt to load assigned master streamdeck config from db
  system.emit('db_get', 'masterStreamdeckConfig', masterStreamdeckConfig => {
    if (masterStreamdeckConfig === undefined) {
      let loop = 0;
      let currentPage = startingPage;
      // if nothing saved in db, generate array of all commands mapped to buttons
      // TODO: include GLOBAL command list once made

      store.masterStreamdeckConfig = creators.flatMap(creator => Object.keys(basicCreatorCommands).flatMap(key => basicCreatorCommands[key].options.map(option => { return { creator: creator, command: key, option: option } }))).map((command, index) => {
        if (index > ((availableButtons.length * (loop + 1)) - 1)) {
          loop++;
          currentPage++;
        }
        let i = index - (availableButtons.length * loop);
        command.page = currentPage;
        command.button = availableButtons[i];
        return command;
      })

      system.emit('db_set', 'masterStreamdeckConfig', store.masterStreamdeckConfig);
    } else {
      store.masterStreamdeckConfig = masterStreamdeckConfig;
    }
  })

  // Attempt to load assigned creator streamdeck config from db
  system.emit('db_get', 'creatorStreamdeckConfig', creatorStreamdeckConfig => {
    if (creatorStreamdeckConfig === undefined) {
      // if nothing saved in db, generate array of available pages / buttons and define command, type and feedback variables as null
      store.creatorStreamdeckConfig = creatorPages.flatMap(page => availableButtons.map(button => { return { page: page, button: button, command: null, type: null, feedback: null, text: null } }))
      system.emit('db_set', 'creatorStreamdeckConfig', store.creatorStreamdeckConfig);
    } else {
      store.creatorStreamdeckConfig = creatorStreamdeckConfig;
    }
  })

  // Attempt to load endpoint config from db
  system.emit('db_get', 'endpointConfig', endpointConfig => {
    if (endpointConfig === undefined) {
      store.endpointConfig = [];
      system.emit('db_set', 'endpointConfig', store.endpointConfig)
    } else {
      store.endpointConfig = endpointConfig;
    }
  })

  system.emit('db_get', 'endpointCommands', endpointCommands => {
    if (endpointCommands === undefined) {
      store.endpointCommands = [];
      system.emit('db_set', 'endpointCommands', endpointCommands);
    } else {
      store.endpointCommands = endpointCommands;
    }
  })

  system.emit('db_get', 'endpointFeedbacks', endpointFeedbacks => {
    if (endpointFeedbacks === undefined) {
      store.endpointFeedbacks = [];
      system.emit('db_set', 'endpointFeedbacks', endpointFeedbacks);
    } else {
      store.endpointFeedbacks = endpointFeedbacks;
    }
  })

  function updateButtonText() {
    Object.keys(store.userIPs).forEach(key => {
      // user = key
      // userIPs[key] = IP

      store.creatorStreamdeckConfig.map(item => {
        if (item.text !== null) {
          const url = `${store.userIPs[key]}/style/bank/${item.page}/${item.button}?text=${item.text}`;
          console.log(url);
          axios.get(url)
            .catch(error => { })
        }
      })
    })
  }

  app.get('/api/v1/updateButtonText', (req, res) => {
    updateButtonText();
    res.send('ok')
  })

  app.get('/changeUser/:page/:button', (req, res) => {
    const { page, button } = req.params;
    changeUser(page, button);
    res.send('ok')
  })

  app.get('/api/v1/endpointConfig', (req, res) => {
    res.status(200).json({
      success: true,
      data: { commands: store.endpointCommands, feedbacks: store.endpointFeedbacks }
    })
  })

  function changeUser(page, button) {
    if (selectedUser === 4) {
      selectedUser = 1;
    } else {
      selectedUser++;
    }

    const finalURL = `http://localhost:8888/style/bank/${page}/${button}?text=User ${selectedUser}`

    axios.get(finalURL)
      .catch(error => { })
    console.log('User:', selectedUser);
  }

  // assigned button on creator stream deck to command
  function setCreatorStreamDeckPageButton(page, button, command, type, feedback, text) {
    const obj = store.creatorStreamdeckConfig.find(item => item.page === page && item.button === button);

    obj.command = command;
    obj.type = type ? type : null;
    obj.feedback = feedback ? feedback : null;
    obj.text = text ? text : null;

    system.emit('db_set', 'creatorStreamdeckConfig', store.creatorStreamdeckConfig);
  }

  function updateUserIPs(newUserIPs) {
    store.userIPs = newUserIPs;
    console.log('UserIPs Updated')
    system.emit('db_set', 'userIPs', store.userIPs);
  }

  let connectionCheck = {
    1: false,
    2: false,
    3: false,
    4: false
  }

  let connectionConfirm = {
    1: false,
    2: false,
    3: false,
    4: false
  }

  function connectionLoop() {
    checkConnections();
    setInterval(() => {
      checkConnections();
    }, 10000)
  }

  connectionLoop();

  function checkConnections() {
    // this runs every 10 seconds
    Object.keys(store.userIPs).forEach(key => {
      const url = `http://${store.userIPs[key]}/press/bank/99/21`;

      // console.log(url);
      console.log('Checking', store.userIPs[key], 'connection')

      connectionCheck[key] = false;

      axios.get(url)
        .then(() => {

        })
        .catch(error => {

        })

      setTimeout(() => {
        if (connectionCheck[key]) {
          // set global connected to true
          connectionConfirm[key] = true;
        } else {
          connectionConfirm[key] = false;
          console.log(key, 'is not connected')
          // set global connected to false
        }
      }, 5000)
    })
  }

  app.get('/api/v1/showConnections', (req, res) => {
    res.status(200).json({
      success: true,
      data: connectionConfirm
    })
  })

  // function checkConnection(user) {

  //   let IP = store.userIPs[user]

  //   const url = `http://${IP}/press/bank/99/21`

  //   console.log(url);

  //   axios.get(url);
  // }

  app.get('/checkConnection/:user', (req, res) => {
    checkConnection(req.params.user);
  })

  app.get('/:user/confirmConnection', (req, res) => {
    const { user } = req.params;

    connectionCheck[user] = true;

    console.log(user, 'is connected')
  })

  app.get('/studio/:endpoint', (req, res) => {
    const { endpoint } = req.params;

    console.log('trying to get to', endpoint);

    let arr = store.endpointCommands.filter(item => item.endpoint === endpoint);

    console.log(arr);

    if (arr.length === 0) {
      res.send('no luck');
    } else {
      res.send('ok')
      arr.forEach(item => {
        console.log('lets run', item.command, item.type, 'as', selectedUser);
        runCommand(selectedUser, item.command, item.type);
      })
    }
  })

  app.get('/api/v1/masterStreamdeckConfig', (req, res) => {
    res.status(200).json({
      success: true,
      count: store.masterStreamdeckConfig.length,
      data: store.masterStreamdeckConfig
    })
  })

  // handle get request for existing config
  app.get('/api/v1/creatorStreamdeckConfig', (req, res) => {
    res.status(200).json({
      success: true,
      count: store.creatorStreamdeckConfig.length,
      data: store.creatorStreamdeckConfig
    })
  })

  // handle get request for available commands
  app.get('/api/v1/availableCommands', (req, res) => {
    res.status(200).json({
      success: true,
      count: Object.keys(allCreatorCommands).length,
      data: allCreatorCommands
    })
  })

  app.post('/api/v1/endpointCommand', (req, res) => {
    const { endpoint, command, type } = req.body;

    if (endpoint === undefined || command === undefined || type === undefined) {
      res.status(400).json({
        success: false,
        error: 'you suck'
      })
      return;
    }

    let obj = {
      endpoint, command, type
    }

    store.endpointCommands.push(obj);
    system.emit('db_set', 'endpointCommands', store.endpointCommands);

    res.status(201).json({
      success: true,
      data: { endpoint, command, type }
    })
  })

  app.post('/api/v1/endpointFeedback', (req, res) => {
    const { feedback, page, button } = req.body;

    if (feedback === undefined || page === undefined || button === undefined) {
      res.status(400).json({
        success: false,
        error: 'you suck'
      })
      return;
    }

    console.log(feedback);
    console.log(page);
    console.log(button);

    console.log(store.endpointFeedbacks);

    let obj = { feedback, page, button };

    store.endpointFeedbacks.push(obj);
    system.emit('db_set', 'endpointFeedbacks', store.endpointFeedbacks);

    res.status(201).json({
      success: true,
      data: { feedback, page, button }
    })
  })

  app.post('/api/v1/endpointCommand/delete', (req, res) => {
    const { endpoint, command, type } = req.body;

    console.log(store.endpointCommands);

    let arr = store.endpointCommands.filter(item => item.endpoint !== endpoint || item.command !== command || item.type !== type);

    console.log(arr);

    store.endpointCommands = arr;

    system.emit('db_set', 'endpointCommands', store.endpointCommands);

    res.status(201).json({
      success: true,
      data: { endpoint, command, type }
    })

    // filter by object value

  })

  app.post('/api/v1/endpointFeedback/delete', (req, res) => {
    const { feedback, page, button } = req.body;

    console.log(feedback, page, button);

    let arr = store.endpointFeedbacks.filter(item => item.feedback !== feedback || item.page !== page || item.button !== button);

    store.endpointFeedbacks = arr;

    system.emit('db_set', 'endpointFeedbacks', store.endpointFeedbacks);

    res.status(201).json({
      success: true,
      data: { feedback, page, button }
    })
  })

  // // add new endpointConfig
  // app.post('/api/v1/endpointConfig', (req, res) => {
  //   const { endpoint, command, type, feedback } = req.body;

  //   if (endpoint === undefined || command === undefined || type === undefined || feedback === undefined) {
  //     res.status(400).json({
  //       success: false,
  //       error: 'you suck'
  //     })
  //     return;
  //   }

  //   // ADD NEW ENDPOING CONFIG

  //   let obj = {
  //     endpoint,
  //     command,
  //     type,
  //     feedback
  //   }

  //   store.endpointConfig.push(obj);

  //   res.status(201).json({
  //     success: true,
  //     data: { endpoint, command, type, feedback }
  //   })
  // })

  app.get('/api/v1/specialPressButtonConfig', (req, res) => {
    res.status(200).json({
      success: true,
      data: store.specialPressButtonConfig
    })
  })

  app.post('/api/v1/specialPressButtonConfig', (req, res) => {
    const buttons = req.body;

    store.specialPressButtonConfig = buttons;

    system.emit('db_set', 'specialPressButtonConfig', store.specialPressButtonConfig)

    res.send('ok');
  })

  function pressMasterStreamdeckButton(key) {
    let { page, button } = store.specialPressButtonConfig[key];

    if (page === undefined || button === undefined) {
      return;
    } else {
      let url = `http://localhost:8888/press/bank/${page}/${button}`

      console.log(url);

      axios.get(url)
        .catch(error => { })
    }

  }

  function sendText(user) {
    // get IP from userIPs

    // go through the entire config and set text per button

    Object.keys(store.creatorStreamdeckConfig).forEach(key => {

      let { page, button, text } = store.creatorStreamdeckConfig[key]

      if (text === null) {
        text = '';
      }

      let url = `http://${store.userIPs[user]}/style/bank/${page}/${button}?text=${text}`

      console.log(url);

      axios.get(url)
        .catch(error => {

        })
    })
  }

  app.get('/api/v1/sendText/:user', (req, res) => {
    const { user } = req.params;

    sendText(user);

    res.send('ok')
  })

  // handle post request to assign creator stream deck to command
  app.post('/api/v1/creatorStreamdeckConfig/update', (req, res) => {
    const { page, button, command, type, feedback, text } = req.body;

    if (page === undefined || button === undefined || command === undefined) {
      res.status(400).json({
        success: false,
        error: 'Big boo boo'
      })
      return;
    }

    setCreatorStreamDeckPageButton(page, button, command, type, feedback, text);

    res.status(201).json({
      success: true,
      data: { page, button, command, type, feedback, text }
    })
  })

  app.get('/api/v1/userIPs', (req, res) => {
    res.status(200).json({
      success: true,
      count: Object.keys(store.userIPs).length,
      data: store.userIPs
    })
  })

  app.post('/api/v1/userIPs', (req, res) => {
    const newUserIPs = req.body;

    if (newUserIPs === undefined) {
      res.status(400).json({
        success: false,
        error: 'Big boo boo'
      })
      return;
    } else {
      updateUserIPs(newUserIPs)
      res.status(201).json({
        success: true,
        data: newUserIPs
      })
    }
  })

  // generate endpoint for each creator available page / button
  // these are generated from the constants defined in constants.js
  // and so are completely decoupled from the config db
  // therefore never need to be updated
  creators.forEach(creator => {
    creatorPages.forEach(page => {
      availableButtons.forEach(button => {
        app.get(`/${creator}/${page}/${button}`, (req, res) => {
          press(creator, page, button);
          res.status(200).json({
            success: true
          })
        })
      })
    })
  })

  // button press function
  function press(creator, page, button) {
    console.log('///////////////////////////////////////')
    console.log(creator, 'PRESSED', page, button);

    // match page / button to config
    const { command, type } = store.creatorStreamdeckConfig.find(item => item.page === page && item.button === button);

    if (command === 'null' || command === null) {
      console.log('No command found');
      return;
    }

    runCommand(creator, command, type);
  }

  // handle run command
  function runCommand(creator, command, type) {
    if (creator !== null && creator !== undefined) {
      // TODO: handle pulling command from globalCommand list
      // handle this if triggered by studio??
    }

    let selectedCommand = allCreatorCommands[command];

    let currentValue = null;

    switch (selectedCommand.selector.type) {
      case 'creator':
        currentValue = state[selectedCommand.selector.device].creators[creator][selectedCommand.selector.key]
        break;
      case 'global':
        currentValue = state[selectedCommand.selector.device][selectedCommand.selector.key]
        break;
      case 'streamdeck':
        break;
      case 'messenger':
        break;
      case 'master_streamdeck':
        break;
      case 'default':
        console.log('uh oh')
    }

    let selectedOption = null;

    if (currentValue !== null) {
      switch (type) {
        case 'UP':
        case 'DOWN':
          {
            let index = selectedCommand.options.indexOf(currentValue);

            if (type === "UP") {
              index++;
            } else if (type === "DOWN") {
              index--;
            }

            if (index > (selectedCommand.options.length - 1) || index < 0) {
              console.log('Index is outside of acceptable range');
              return;
            }

            selectedOption = selectedCommand.options[index];
          }
          break;
        case 'TOGGLE':
          {
            selectedOption = selectedCommand.options.find(option => option !== currentValue);
          }
          break;
        case 'SELECT':
          {
            selectedOption = selectedCommand.options[0];
          }
          break;
        default:
          console.log('COMMAND TYPE NOT FOUND');
          return;
      }
    }

    if (selectedOption !== null) {
      // find page + button from masterStreamdeckConfig by command, creator and selected option
      const { page, button } = store.masterStreamdeckConfig.find(item => item.command === command && item.creator === creator && item.option === selectedOption)

      console.log('PRESS ON MASTER', page, button);
      console.log(command, selectedOption);

      axios.get(`http://localhost:8888/press/bank/${page}/${button}`)
    }

    updateState(creator, command, selectedCommand, selectedOption);
  }

  function updateState(creator, commandName, selectedCommand, selectedOption) {
    const toUpdate = store.creatorStreamdeckConfig.filter(({ feedback }) => feedback === commandName);

    if (selectedCommand.options[0] === 'creator') {
      selectedOption = creator;
    }

    switch (selectedCommand.selector.type) {
      case 'creator':
        state[selectedCommand.selector.device].creators[creator][selectedCommand.selector.key] = selectedOption;
        toUpdate.forEach(item => {
          sendFeedback(creator, commandName, selectedCommand, selectedOption, item.page, item.button)
        })
        break;
      case 'global':
        // need to do the value updates before this??
        state[selectedCommand.selector.device][selectedCommand.selector.key] = selectedOption;
        toUpdate.forEach(item => {
          [1, 2, 3, 4].forEach(user => {
            sendFeedback(user, commandName, selectedCommand, selectedOption, item.page, item.button);
          })
        })
        break;
      case 'streamdeck':
        changeStreamdeckPage(creator, selectedCommand.selector.key)
        break;
      case 'messenger':
        alertStudio(creator, selectedCommand.selector.key)
        break;
      case 'master_streamdeck':
        pressMasterStreamdeckButton(selectedCommand.selector.key);
        break;
      default:
        console.log('uh oh');
    }
  }

  function changeStreamdeckPage(user, page) {
    console.log('CHANGE STREAMDECK FOR USER', user, 'TO PAGE', page)

    const IP = store.userIPs[user];

    const finalURL = `http://${IP}/press/bank/99/${page}`

    console.log(finalURL);
  }

  function alertStudio(user, alert) {
    console.log('USER', user, 'WANTS TO ALERT THE STUDIO', alert);
  }

  function sendFeedback(user, commandName, selectedCommand, selectedOption, page, button) {

    let params = null;

    let urlPrepend = null;
    let urlAppend = null;

    switch (selectedCommand.type[0]) {
      case 'TOGGLE':
        urlPrepend = 'style/bgcolor'
        if (selectedOption === selectedCommand.options[0]) {
          urlAppend = '255/255/255'
          params = 'bgcolor=#FFFFFF'
        } else if (selectedOption === selectedCommand.options[1]) {
          urlAppend = '0/0/0'
          params = 'bgcolor=#000000'
        }
        break;
      case 'UP':
      case 'DOWN':
        urlPrepend = 'style/text'
        urlAppend = selectedOption;
        params = `text=${selectedOption}`
        break;
      case 'SELECT':
        urlPrepend = 'style/bgcolor'
        if (selectedOption === user) {
          urlAppend = '255/255/255'
          params = 'bgcolor=#FFFFFF'
        } else {
          urlAppend = '0/0/0'
          params = 'bgcolor=#000000'
        }
        break;
      default:
        console.log('ohhh nooo')
    }

    const IP = store.userIPs[user];

    // style/bank/PAGE/BUTTON?bgColor=#FFFFFF
    // style/bank/PAGE/BUTTON?bgColor=#000000

    // style/bank/PAGE/BUTTON?text=TEXT

    const finalURL = `http://${IP}/style/bank/${page}/${button}?${params}`

    console.log(finalURL);

    axios.get(finalURL)
      .catch(error => { })


    // also need to handle sending feedback to studio streamdeck
    // user, commandName, selectedCommand, selectedOption, page, button
    // plus preformatted params

    // need to match commandName to store.endpointFeedbacks??
    // then sent request to localhost:5000/ ^page / ^button / params

    let arr = store.endpointFeedbacks.filter(item => item.feedback === commandName);

    arr.forEach(a => {
      const studioURL = `http://localhost:8888/style/bank/${a.page}/${a.button}?${params}`
      console.log(studioURL);

      axios.get(studioURL)
        .catch(error => { })
    })

  }
}

init();