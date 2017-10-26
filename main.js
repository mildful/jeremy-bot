const Nightmare = require('nightmare')
const fs = require('fs')

const Config = require('./config')
const Utils = require('./utils')
const Grid = require('./grid')
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
const gridRawTransformsProxy = new Function('return ' + Grid.getRawTransforms.toString())()
nightmare
    .goto('http://chro-ma.com/minigame')
    .wait('#start')
    .click('#start')
    .wait('.avatar-deimos-asset')
    .wait(1000)
    .evaluate(gridRawTransformsProxy)
    .then(rawTransforms => {
        grid.evalRawTransforms(rawTransforms)
        // ui.render()
        Logger.logGrid(ui.getStringGrid(), err => {
            if (err) console.error(err)
        })
    })
    .catch(console.error)
