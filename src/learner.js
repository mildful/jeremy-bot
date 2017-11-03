const Synaptic = require('synaptic')
const { Architect, Network } = Synaptic
const Nightmare = require('nightmare')
const Async = require('async')
const _ = require('lodash')

const Config = require('../config')
const GameAPI = require('./game-api')
const Grid = require('./grid')

class Learner {
  static executeOutputs (game, outputs) {
    const [ movement, jump, punch ] = outputs
    // movement
    if (movement < .45) game.moveLeft()
    else if (movement > .55) game.moveLeft()
    else game.stopMoving()
    // jump
    if (jump > .5) game.jump()
    // punch
    if (punch > .5) game.punch()
  }

  // for all neurons of all layers, we find a cut location
  // and swap biais between A and B
  static crossOver (jsonA, jsonB) {
    const neuronsA = jsonA.neurons
    const neuronsB = jsonB.neurons
    const cutLocation = Math.round(neuronsA.length * Math.random())
    for (let i = 0; i < cutLocation; i++) {
      // const tmpA = neuronsA[i].bias
      neuronsA[i].bias = neuronsB[i].bias
      // neuronsB[i].bias = tmpA
    }
    return Object.assign({}, jsonA, { neurons: neuronsA })
  }

  constructor (nightmareConfig, generationSize = 8, selectionCount = 3, mutationRate = .2) {
    // public fields
    this.generation = 0
    this.genome = 0
    this.generationSize = generationSize
    this.selectionCount = selectionCount
    this.mutationRate = mutationRate
    this.nightmareConfig = nightmareConfig
    // private fields
    this._processes = []
    for (let i = this._processes.length; i < this.generationSize; i++) {
      this._processes.push(this.buildProcess())
    }
  }

  executeGeneration () {
    this.generation++
    this.genome = 0
    Async.mapSeries(this._processes, this.startProcess.bind(this), this.evolve.bind(this))
  }

  evolve () {
    // select best
    let genomesSelection = _.sortBy(this._processes, p => p.genome.fitness).slice(0, this.selectionCount).map(p => p.genome)
    // cross over
    let selectionJson = genomesSelection.map(g => g.toJSON())
    while (genomesSelection.length < this.generationSize) {
      const jsonA = _.sample(selectionJson)
      const jsonB = _.sample(selectionJson)
      const childJson = Learner.crossOver(jsonA, jsonB)
      genomesSelection.push(Network.fromJSON(childJson))
    }
    this._processes = genomesSelection.map(genome => {
      // mutate
      const m = Network.fromJSON(this.mutate(genome.toJSON()))
      // build process
      return this.buildProcess(m)
    })
    // and again...
    this.executeGeneration()
  }

  mutate (nnJson) {
    // using same maths as IAMDinosaurs.
    // Need to find out my way !
    this.mutateKey(nnJson, 'bias')
    this.mutateKey(nnJson, 'weight')
    return nnJson
  }

  mutateKey (nnJson, key) {
    for (let i = 0, l = nnJson.length; i < l; i++) {
      if (Math.random() > this.mutationRate) {
        continue
      }
      nnJson[i][key] += nnJson[i][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5)
    }
  }

  buildProcess (genome = undefined) {
    const nightmare = Nightmare(this.nightmareConfig)
    const grid = new Grid(
      Config.gridCols, Config.gridRows,
      Config.width, Config.height,
      { debug: true }
    )
    return {
      nightmare,
      game: new GameAPI(nightmare),
      grid,
      genome: genome || new Architect.Perceptron(grid.vgrid.grid.length, 4, 4, 3)
    }
  }

  startProcess ({ game, grid, genome, nightmare }, next) {
    this.genome++
    console.log(`GENERATION: ${this.generation} GENOME: ${this.genome}`)
    let interval
    const onGameStart = () => interval = setInterval(() => game.readGame(), Config.tickTime)
    const onGameTick = () => {
      grid.evalPixelPositions(game.gameDatas.pixelPositions)
      const inputs = grid.vgrid.grid
      const outputs = genome.activate(inputs)
      Learner.executeOutputs(game, outputs)
    }
    const onGameEnd = () => {
      genome.fitness = game.gameDatas.metadatas.score
      nightmare.end().then(() => {
        nightmare.proc.kill()
        nightmare.ended = true
        nightmare = null
        next()
      }).catch(console.error)
    }
    game.onGameStart(onGameStart)
    game.nextTick(onGameTick)
    game.onGameEnd(onGameEnd)
    // start
    game.startNewGame()
  }
}

module.exports = Learner
