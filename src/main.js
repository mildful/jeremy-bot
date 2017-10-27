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
const getBrowserDatasProxy = new Function('return ' + BrowserAPI.getBrowserDatas.toString())()
const compute = () => {
  return nightmare
    .evaluate(getBrowserDatasProxy)
    .then(datas => {
      grid.evalRawTransforms(datas.transforms)
      // ui.render()
      const metadatas = {
        hp: datas.hp,
        gameover: datas.gameover
      }
      // doing this add ~20ms of computation
      Logger.logDatas(metadatas, ui.getStringGrid(), err => {
        if (err) console.error(err)
      })
    })
}

async function start () {
  const startTime = +new Date()
  try {
    await compute()
  } catch (err) {
    console.error(err)
  }
  const endTime = +new Date()
  const delta = endTime - startTime
  const delay = delta < Config.tickTime ? Config.tickTime : 0
  console.log(delta, delay)
  setTimeout(start, delay)
}

nightmare
  .goto('http://chro-ma.com/minigame')
  .wait('#start')
  .click('#start')
  .wait('.avatar-deimos-asset')
  .wait(100)
  .then(start)
  .catch(console.error)

