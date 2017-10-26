const fs = require('fs')
const path = require('path')

const Config = require('../config')

class Logger {
  static log (filename, subpath, content, err) {
    subpath = subpath[subpath.length - 1] === '/' ? subpath : subpath + '/'
    const path = subpath ? Config.logFolder + subpath : Config.logFolder
    fs.writeFile(path + filename, content, err)
  }

  static logGrid (grid, subpath, err) {
    const filename = subpath ? 'grid' : `grid-${+new Date()}`
    Logger.log(`${filename}.txt`, subpath, grid, err)
  }

  static logMetadatas (metadatas, subpath, err) {
    const filename = subpath ? 'metadatas' : `metadatas-${+new Date()}`
    const content = JSON.stringify(metadatas)
    Logger.log(`${filename}.json`, subpath, content, err)
  }

  static logDatas (metadatas, grid, errcb) {
    const subpath = +new Date()
    const dirPath = path.join(__dirname, '..', Config.logFolder, +new Date() + '')
    fs.mkdir(dirPath, err => {
      if (err) errcb(err)
      else {
        Logger.logGrid(grid, subpath, errcb)
        Logger.logMetadatas(metadatas, subpath, errcb)
      }
    })
  }
}

module.exports = Logger
