const fs = require('fs')

const LOG_PATH = './logs/'

class Logger {
  static log (filename, content, err) {
    fs.writeFile(LOG_PATH + filename + '.txt', content, err)
  }

  static logGrid (grid, err) {
    Logger.log(`grid-${+Date.now()}`, grid, err)
  }
}

module.exports = Logger
