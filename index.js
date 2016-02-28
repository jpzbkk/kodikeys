var fs = require('fs');
var path = require('path');
var xec = require('xbmc-event-client');

var keyboard = require('./lib/keyboard');


var kodikeys = function(opt) {

  var defaults = {
    port: 9777
  }
  opt = Object.assign({}, defaults, opt);

  var kodi = new xec.XBMCEventClient('kodikeys', opt)

  kodi.connect(function(errors, bytes) {
    if (errors.length) {
      console.error(`Connection failed to Kodi on $(opt.host), port ${opt.port}`)
      console.error(errors[0].toString());
      process.exit(1);
    }

    // init keyboard interactivity
    keyboard.init(kodi);

    console.log(`connected to ${opt.host} port ${opt.port}`);
  });
}

module.exports = kodikeys;
