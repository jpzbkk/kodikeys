var term = require('terminal-kit').terminal
var log = require('./logging')


var keyboard = {

  // Key map: kodi recognizes some keys differently than terminal-kit reports
  mapKeys: {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
    '-': 'minus',
    '+': 'plus',
    '=': 'equals',
    '.': 'period',
    ',': 'comma',
    ' ': 'space',
    '\'': 'quote',
    '"': 'doublequote',
    '`': 'leftquote',
    '~': 'tilde',
    '_': 'underbar',
    '/': 'forwardslash',
    '\\': 'backslash',
    ';': 'semicolon',
    ':': 'colon',
    '[': 'opensquarebracket',
    ']': 'closesquarebracket',
    'page_up': 'pageup',
    'page_down': 'pagedown',
  },

  init: function (kodi) {
    this.kodi = kodi

    // when finished
    return new Promise( (resolve, reject) => {

      // Start grabbing key presses
      term.grabInput()

      term.on('key', (keyname, matches, data) => {
        log.debug('keypress:', keyname)

        // Exit key
        if (keyname === 'CTRL_C') {
          resolve(this.disconnect())
          return
        }

        var key = this._normalizeKeyPress(keyname)

        log.info('sending:', key)
        kodi.keyPress(key, (err, bytes) => {
          if (err.length) {
            log.error(err)
          }
        })
      })
    })
  },

  disconnect: function () {
    this.kodi.disconnect()
    term.grabInput(false)
  },

  _normalizeKeyPress: function (key) {
    key = key.toLowerCase()

    if (key.indexOf('ctrl_') === 0) {
      key = 'ctrl_' + this._getMappedKey(key.split('_')[1])
    }
    else {
      key = this._getMappedKey(key)
    }

    return key
  },

  _getMappedKey: function (key) {
    return this.mapKeys[key] || key
  }
}


module.exports = keyboard
