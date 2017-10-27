const Nightmare = require('nightmare')
const fs = require('fs')

const Config = require('../config')
const Grid = require('./grid')
const BrowserAPI = require('./browser-api')
const UI = require('./UI')
const Logger = require('./logger')

// init nightmare
let nightmareConfig = {
  show: !Config.train,
  width: Config.width,
  height: Config.height
}
if (Config.debug) {
  nightmareConfig.openDevTools = { mode: 'detach' }
}
const nightmare = Nightmare(nightmareConfig)

// init grid
const grid = new Grid(
  Config.gridCols, Config.gridRows,
  Config.width, Config.height,
  { debug: true }
)

// init UI
const ui = new UI(grid, false)

// start !
const getGameDatasProxy = new Function('return ' + GameAPI.getGameDatas.toString())()
const compute = () => {
  return nightmare
    .evaluate(getGameDatasProxy)
    .then(datas => {
      grid.evalPixelPositions(datas.pixelPositions)
      // ui.render()
      // doing this add ~25ms of computation
      Logger.logDatas(datas.metadatas, ui.getStringGrid(), err => {
        if (err) console.error(err)
      })
      return datas.metadatas.hp <= 0
    })
}

async function start () {
  const startTime = +new Date()
  let gameover;
  try {
    gameover = await compute()
  } catch (err) {
    console.error(err)
  }
  if (gameover === false) {
    const endTime = +new Date()
    const delta = endTime - startTime
    const delay = delta < Config.tickTime ? Config.tickTime : 0
    console.log(delta)
    setTimeout(start, delay)
  }
}

nightmare
  .goto('http://chro-ma.com/minigame')
  .wait('#start')
  .click('#start')
  .wait('.avatar-deimos-asset')
  .then(start)
  .catch(console.error)

