const Config = require('../config')
const GameAPI = require('./game-api')
const UI = require('./UI')
const Learner = require('./learner')

GameAPI.createCustomNightmareActions()
let nightmareConfig = {
  show: !Config.train,
  width: Config.width,
  height: Config.height
}
if (!Config.train && Config.debug) {
  nightmareConfig.openDevTools = { mode: 'detach' }
}

new Learner(nightmareConfig).executeGeneration()

