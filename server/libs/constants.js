const creators = [1, 2, 3, 4];

const faderPositions = [-36, -24, -12, -6, -3, 0, 3, 6];

const availableButtons = [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 17, 18, 19, 20, 21];

const creatorPages = [1, 2, 3, 4, 5];

const startingPage = 50;

// describe the commands which will need to be sent to the master companion
const basicCreatorCommands = {
  'SET MUTE': {
    type: ['TOGGLE'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'mute'
    },
    // FEEDBACK FOR TOGGLE UPDATES BGCOLOR DEPENDING ON VALUE
    options: ['MUTE', 'UNMUTE']
  },
  'SET MIXBUS LEVEL': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'mixbus'
    },
    // FEEDBACK FOR UP/DOWN SIMPLY SENDS TEXT VALUE
    options: faderPositions
  },
  'SET LEVEL OF DISCORD TO MIXBUS': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'discord'
    },
    options: faderPositions
  },
  'SET LEVEL OF GAME TO MIXBUS': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'game'
    },
    options: faderPositions
  },
  'SET LEVEL OF MUSIC TO MIXBUS': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'music'
    },
    options: faderPositions
  },
  'SWITCH PROGRAM TO creator': {
    type: ['SELECT'],
    selector: {
      type: 'global',
      device: 'vMix',
      key: 'program'
    },
    // FEEDBACK FOR SELECT
    // IF KEY IS "creator"
    // MATCHES creator NUMBER AGAINST VALUE
    feedback: {
      key: 'creator'
    },
    options: ['creator']
  },
  'SET LEVEL OF HEADSET 1 TO MIXBUS': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'headset1'
    },
    options: faderPositions
  },
  'SET LEVEL OF HEADSET 2 TO MIXBUS': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'headset2'
    },
    options: faderPositions
  },
  'SET LEVEL OF HEADSET 3 TO MIXBUS': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'headset3'
    },
    options: faderPositions
  },
  'SET LEVEL OF HEADSET 4 TO MIXBUS': {
    type: ['UP', 'DOWN'],
    selector: {
      type: 'creator',
      device: 'X32',
      key: 'headset4'
    },
    options: faderPositions
  },
  'SEND PC1 TO MONITOR OUTPUT': {
    type: ['SELECT'],
    selector: {
      type: 'creator',
      device: 'Videohub',
      key: 'monitorFeed'
    },
    // FEEDBACK FOR SELECT
    // IF NOT "creator"
    // MATCHES KEY AGAINST VALUE
    feedback: {
      key: 1
    },
    options: [1]
  },
  'SEND PC2 TO MONITOR OUTPUT': {
    type: ['SELECT'],
    selector: {
      type: 'creator',
      device: 'Videohub',
      key: 'monitorFeed'
    },
    feedback: {
      key: 2
    },
    options: [2]
  },
  'SEND PC3 TO MONITOR OUTPUT': {
    type: ['SELECT'],
    selector: {
      type: 'creator',
      device: 'Videohub',
      key: 'monitorFeed'
    },
    feedback: {
      key: 3
    },
    options: [3]
  },
  'SEND PC4 TO MONITOR OUTPUT': {
    type: ['SELECT'],
    selector: {
      type: 'creator',
      device: 'Videohub',
      key: 'monitorFeed'
    },
    feedback: {
      key: 4
    },
    options: [4]
  },
  /*

  this should probably sit in it's own list of commands somewhere

  it needs to be available as a creator streamdeck button

  but NOT get built into the main list of master streamdeck commands

  'SET TO PAGE 1': {
    type: ['SELECT'],
    selector: {
      type: 'special',
      device: 'companion',
      key: 'creator' // this may not be necessary
    },
    options: [1]
  }

  // this needs to send a trigger back to the same streamdeck it came from
  // can track which page we're on in the state?? - necessary?

  repeat for pages 1 - 5

  'SEND ALERT TO STUDIO': {
    type: ['SELECT'],
    selector: {
      type: 'special',
      device: 'messenger',
      key: ??? not necessary??
    }
  }

  // this doesn't need to send a trigger anywhere

  // doesn't need to track

  // need to build a messaging system in here somehow

  */
}

const specialCreatorCommands = {
  'SET TO PAGE 1': {
    type: ['SELECT'],
    selector: {
      type: 'streamdeck',
      device: 'streamdeck',
      key: 1
    },
    options: [1]
  },
  'SET TO PAGE 2': {
    type: ['SELECT'],
    selector: {
      type: 'streamdeck',
      device: 'streamdeck',
      key: 2
    },
    options: [2]
  },
  'SET TO PAGE 3': {
    type: ['SELECT'],
    selector: {
      type: 'streamdeck',
      device: 'streamdeck',
      key: 3
    },
    options: [3]
  },
  'SET TO PAGE 4': {
    type: ['SELECT'],
    selector: {
      type: 'streamdeck',
      device: 'streamdeck',
      key: 4
    },
    options: [4]
  },
  'SET TO PAGE 5': {
    type: ['SELECT'],
    selector: {
      type: 'streamdeck',
      device: 'streamdeck',
      key: 5
    },
    options: [5]
  },
  'SEND ALERT 1': {
    type: ['SELECT'],
    selector: {
      type: 'messenger',
      device: 'messenger',
      key: 1
    },
    options: [1]
  },
  'SEND ALERT 2': {
    type: ['SELECT'],
    selector: {
      type: 'messenger',
      device: 'messenger',
      key: 2
    },
    options: [2]
  },
  'SEND ALERT 3': {
    type: ['SELECT'],
    selector: {
      type: 'messenger',
      device: 'messenger',
      key: 3
    },
    options: [3]
  },
  'SEND ALERT 4': {
    type: ['SELECT'],
    selector: {
      type: 'messenger',
      device: 'messenger',
      key: 4
    },
    options: [4]
  },
  'SEND ALERT 5': {
    type: ['SELECT'],
    selector: {
      type: 'messenger',
      device: 'messenger',
      key: 5
    },
    options: [5]
  },
  'PRESS BUTTON 1': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 1
    },
    options: [1]
  },
  'PRESS BUTTON 2': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 2
    },
    options: [2]
  },
  'PRESS BUTTON 3': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 3
    },
    options: [3]
  },
  'PRESS BUTTON 4': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 4
    },
    options: [4]
  },
  'PRESS BUTTON 5': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 5
    },
    options: [5]
  },
  'PRESS BUTTON 6': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 6
    },
    options: [6]
  },
  'PRESS BUTTON 7': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 7
    },
    options: [7]
  },
  'PRESS BUTTON 8': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 8
    },
    options: [8]
  },
  'PRESS BUTTON 9': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 9
    },
    options: [9]
  },
  'PRESS BUTTON 10': {
    type: ['SELECT'],
    selector: {
      type: 'master_streamdeck',
      device: 'master_streamdeck',
      key: 10
    },
    options: [10]
  }
}

const allCreatorCommands = { ...basicCreatorCommands, ...specialCreatorCommands };

module.exports = {
  creators,
  basicCreatorCommands,
  specialCreatorCommands,
  allCreatorCommands,
  availableButtons,
  creatorPages,
  startingPage
}