var term = require('terminal-kit').terminal;
var log = require('./logging');


var keyboard = {

  // Key map: kodi recognizes some keys differently than terminal-kit reports
  mapKeys: {
    '-': 'minus',
    '+': 'plus',
    '=': 'equals',
    '.': 'period',
    ',': 'comma',
    ' ': 'space',
    'page_up': 'pageup',
    'page_down': 'pagedown',
  },

  keyQueue: [],

  init: function(kodi, opt) {
    this.kodi = kodi;

    // when finished
    return new Promise( (resolve, reject) => {

      // Start grabbing key presses
      term.grabInput();

      term.on('key', (keyname, matches, data) => {
        log.debug('keypress:', keyname)

        // Exit key
        if (keyname === 'CTRL_C') {
          resolve(this.disconnect());
          return;
        }

        var key = this._normalizeKeyPress(keyname);

        log.info('sending:', key);
        kodi.keyPress(key, (err, bytes) => {
          if (err.length) {
            log.error(err);
          }
        });

        // Save the last 3 keys to detect escape sequence
        this.keyQueue.unshift(keyname);
        this.keyQueue = this.keyQueue.slice(0, 3);
      })
    });
  },

  disconnect: function() {
    this.kodi.disconnect();
    term.grabInput(false);
  },

  _normalizeKeyPress: function(key) {
    key = key.toLowerCase();

    // Check for escape sequences
    // For some reason terminal-kit/node misses some escape sequences, so we
    // need to look for them manually as separate key events.

    // Arrow keys
    // e.g. LEFT sometimes comes as separate "ESC [ d" keypresses
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

    // Home
    if (this.keyQueue[3] === 'escape' &&
        this.keyQueue[2] === '[' &&
        this.keyQueue[1] === '1' &&
          key === '~') {
            key = 'home';
          }

    if (this.mapKeys[key]) {
      key = this.mapKeys[key]
    }

    return key;
  }
}


module.exports = keyboard;
