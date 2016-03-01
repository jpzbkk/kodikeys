var logger = exports


logger.levels = ['error', 'warn', 'info', 'debug']
logger.debugLevel = 'warn'


logger.setLevel = function (level) {
  if (logger.levels.indexOf(level) === -1) {
    throw new Error(`Log level must be one of ${logger.levels}`)
  }
  logger.debugLevel = level
}


logger.log = function () {
  var level = arguments[0]
  var messages = Array.prototype.slice.call(arguments, 1)

  var levels = logger.levels
  if (levels.indexOf(level) <= levels.indexOf(logger.debugLevel) ) {
    messages = messages.map( m => {
      if (typeof m !== 'string') {
        return JSON.stringify(m)
      }
      return m
    })
    console.log(level + ':', messages.join(' '))
  }
}


logger.levels.forEach( (level) => {
  logger[level] = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift(level)
    logger.log.apply(logger, args)
  }
})
