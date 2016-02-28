var term = require('terminal-kit').terminal;


function terminate(kodi) {
  console.log('Bye')
  kodi.disconnect();
  term.grabInput(false);
  setTimeout( () => { process.exit() }, 100 );
}


var keyboard = {

  // Keys that will be sent to kodi
  allowedkeys: [
    'left',
    'right',
    'up',
    'down',
    'backspace',
    'tab',
    'enter',
    'minus',
    'plus',
    'equals',
    'space',
    'period',
    'comma',
    'escape',
    'home',
    'f8'
  ].concat('abcdefghijklmnopqrstuvwxyz1234567890'.split('')),

  // Key map: kodi recognizes some keys differently than terminal-kit reports
  // them. Here we map them to the kodi version.
  mapKeys: {
    '-': 'minus',
    '+': 'plus',
    '=': 'equals',
    '.': 'period',
    ',': 'comma',
    ' ': 'space',
  },

  keyQueue: [],

  init: function(kodi) {
    this.kodi = kodi;

    // Start grabbing key presses
    term.grabInput();

    term.on('key', (key, matches, data) => {

      //console.log('keypress:', key, data);

      key = key.toLowerCase();

      // Check for buggy escape sequence
      if (this.keyQueue[1] === 'escape' && this.keyQueue[0] === '[') {
        switch(key) {
          case 'a':
            key = 'up';
            break;
          case 'b':
            key = 'down';
            break;
          case 'c':
            key = 'right';
            break;
          case 'd':
            key = 'left';
            break;
        }
      }
      if (this.keyQueue[3] === 'escape' &&
          this.keyQueue[2] === '[' &&
          this.keyQueue[1] === '1' &&
          key === '~') {
            key = 'home';
      }

      // Check for mapped keys
      if (this.mapKeys[key]) {
        key = this.mapKeys[key];
      }

      if (this.allowedkeys.indexOf(key) !== -1) {
        //console.log('sending: ', key);
        kodi.keyPress(key);
      }
      else {
        switch(key) {
          case 'ctrl_c':
            terminate(kodi);
            break;
          default:
            console.log('no action for:', key);
            break;
        }
      }

      // Save keys to detect escape sequence
      this.keyQueue.unshift(key);
      //console.log(this.keyQueue);
      this.keyQueue = this.keyQueue.slice(0, 3);
    })
  }
}


module.exports = keyboard;
