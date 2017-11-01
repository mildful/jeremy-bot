const Nightmare = require('nightmare')

const Config = require('../config')
const Grid = require('./grid')
const GameAPI = require('./game-api')
const UI = require('./UI')
const Logger = require('./logger')

// init nightmare
GameAPI.createCustomNightmareActions()
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

// init game
const game = new GameAPI(nightmare)

let interval

const onGameStart = function () {
  interval = setInterval(() => game.readGame(), Config.tickTime)
  setInterval(() => game.moveRight(), 1000)
}

const onTick = function () {
  grid.evalPixelPositions(game.gameDatas.pixelPositions)
  // ui.render()
  // doing this add ~25ms of computation (at least, on my computer of course - Win7 64bits, i7 6600U, 8GB ram)
  Logger.logDatas(game.gameDatas.metadatas, ui.getStringGrid(), err => {
    if (err) console.error(err)
  })
  return game.gameDatas.metadatas.hp <= 0
}

const onGameOver = function () {
  clearInterval(interval)
  console.log('Game over. SCORE: ', game.gameDatas.metadatas.score)
}

game.onGameStart(onGameStart)
game.nextTick(onTick)
game.onGameEnd(onGameOver)
game.startNewGame().catch(console.error)

// use this to debug read time
/*
async function startReadingGame () {
  const startTime = +new Date()
  let gameover;
  try {
    gameover = await game.readGame()
  } catch (err) {
    console.error(err)
  }
  if (gameover === false) {
    const endTime = +new Date()
    const delta = endTime - startTime
    const delay = delta < Config.tickTime ? Config.tickTime : 0
    console.log('reading game time: ', delta)
    setTimeout(startReadingGame, delay)
  }
}
*/
