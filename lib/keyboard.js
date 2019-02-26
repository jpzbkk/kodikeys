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
    "'": 'quote',
    '"': 'doublequote',
    '`': 'leftquote',
    '~': 'tilde',
    _: 'underbar',
    '/': 'forwardslash',
    '\\': 'backslash',
    ';': 'semicolon',
    ':': 'colon',
    '[': 'opensquarebracket',
    ']': 'closesquarebracket',
    page_up: 'pageup',
    page_down: 'pagedown',
    h: ' ',
    j: ' ',
    k: ' ',
    l: ' ',
    // backspace: 8
    enter: 'enter'
  },

  capture: function (ev_client) {
    this.ev_client = ev_client
    this.paused = false

    return new Promise((resolve, reject) => {
      // Start grabbing key presses
      term.grabInput()

      term.on('key', (keyname, matches, data) => {
        if (this.paused) {
          return
        }
        log.debug('keypress:', keyname, data)

        // Exit key
        if (keyname === 'CTRL_C') {
          resolve(this.disconnect())
          return
        }

        this.sendKey(this._normalizeKeyName(keyname))
      })
    })
  },

  pauseCapture: function () {
    this.paused = true
    log.debug('pausing capture')
  },

  resumeCapture: function () {
    this.paused = false
    log.debug('resuming capture')
  },

  startTextEntry: function () {
    this.pauseCapture()

    term.bold.yellow('\nKodi is requesting text input\n')
    term.bold('Enter text to send: ')

    return new Promise((resolve, reject) => {
      this._textInput = term.inputField((error, input) => {
        term('\n')
        if (error) {
          log.error(error)
          reject(error)
        } else {
          resolve(input)
        }
        this.exitTextEntry()
      })
    })
  },

  exitTextEntry: function () {
    if (this._textInput) {
      this._textInput.abort()
      this._textInput = null
      this.resumeCapture()
    }
  },

  disconnect: function () {
    term.grabInput(false)
  },

  sendKey: function (key) {
    log.info('sending key:', key)

    this.ev_client.keyPress(key, (err, bytes) => {
      if (err.length) {
        log.error(err)
      }
    })
  },

  _normalizeKeyName: function (key) {
    key = key.toLowerCase()

    // Handle modifiers
    // TODO: ctrl & alt modifiers are not actually working.
    // I haven't figured out a way to send them properly to Kodi's event server
    var mods = ['ctrl', 'alt']
    mods.forEach(mod => {
      key = key.replace(mod + '_', mod + '__')
    })

    var keys = key.split('__')
    keys[keys.length - 1] = this._getMappedKey(keys[keys.length - 1])
    // console.log('keys', keys)
    return keys.join('-')
  },

  _getMappedKey: function (key) {
    // console.log(key, this.mapKeys[key], this.mapKeys[key] || key)
    return this.mapKeys[key] || key
  }
}

module.exports = keyboard
