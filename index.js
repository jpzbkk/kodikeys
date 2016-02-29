'use strict';

var fs = require('fs');
var path = require('path');
var xec = require('xbmc-event-client');
var keyboard = require('./lib/keyboard');
var log = require('./lib/logging');


var kodikeys = function(opt) {

  opt = Object.assign({}, {
    port: 9777,
    log_level: 'warn',
  }, opt);

  log.setLevel(opt.log_level)

  return new Promise( (resolve, reject) => {

    var kodi = new xec.XBMCEventClient('kodikeys', {
      host: opt.host,
      port: opt.port,
    })

    kodi.connect(function(errors, bytes) {
      if (errors.length) {
        let msg = `Connection failed to host ${opt.host}, port ${opt.port}`;
        log.error(msg)
        log.error(errors[0].toString());
        reject(msg, errors);
        return;
      }

      // init keyboard interactivity
      keyboard.init(kodi)
        .then(function finished() {
          resolve();
        });

      // ping to keep connection  alive
      setInterval(kodi.ping.bind(kodi), 55 * 1000);

      console.log(`connected to ${opt.host} port ${opt.port}`);
    });

  })

}

module.exports = kodikeys;
