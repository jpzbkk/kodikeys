var fs = require('fs');
var path = require('path');
var xec = require('xbmc-event-client');
var keyboard = require('./lib/keyboard');
var log = require('./lib/logging');


var kodikeys = function(opt) {

  var defaults = {
    port: 9777,
    log_level: 'warn',
  }
  opt = Object.assign({}, defaults, opt);

  log.setLevel(opt.log_level)

  var kodi = new xec.XBMCEventClient('kodikeys', {
    host: opt.host,
    port: opt.port,
  })

  kodi.connect(function(errors, bytes) {
    if (errors.length) {
      log.error(`Connection failed to host ${opt.host}, port ${opt.port}`)
      log.error(errors[0].toString());
      process.exit(1);
    }

    // init keyboard interactivity
    keyboard.init(kodi);

    // ping to keep connection  alive
    setInterval(kodi.ping.bind(kodi), 55 * 1000);

    console.log(`connected to ${opt.host} port ${opt.port}`);
  });
}

module.exports = kodikeys;
