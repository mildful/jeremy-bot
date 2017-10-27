const _getGameDatas = function () {
  const datas = {
    transforms: {
      player: null,
      enemies: [],
      bullets: []
    },
    metadatas: {
      hp: null,
      enemiesCount: null,
      score: null
    }
  }

  // hp
  datas.metadatas.hp = parseInt(document.getElementById('hp-bar-current').style.width)
  // score
  const timeStr = document.getElementById('game-timer').textContent.split(':')
  datas.metadatas.score = timeStr[0] * 60 + parseFloat(timeStr[1])

  // game ended
  if (datas.metadatas.hp <= 0) return datas

  // player
  datas.transforms.player = document.getElementsByClassName('avatar-deimos-asset')[0].style.transform
  // enemies
  const enemies = document.getElementsByClassName('monster-deimos-asset')
  for (let i = 0, l = enemies.length; i < l ; i++) {
    datas.transforms.enemies.push(enemies[i].style.transform)
  }
  // bullets
  const bullets = document.querySelectorAll('[id^=projectile]')
  for (let i = 0, l = bullets.length; i < l ; i++) {
    datas.transforms.bullets.push(bullets[i].style.transform)
  }

  datas.metadatas.enemiesCount = enemies.length

  return datas
}
const _getGameDatasProxy = new Function('return ' + _getGameDatas.toString())()
const _dispatch = function (callbacks, ...args) {
  callbacks.forEach(function (cb) { cb(...args) })
}

class GameAPI {
  static getPixelsFromTranslate (str) {
    const regex = /(\d+)px/g
    const x = +regex.exec(str)[1]
    const y = +regex.exec(str)[1]
    return { x, y }
  }

  constructor (nightmareInstance) {
    this.nightmare = nightmareInstance
    this._init()
    this.nightmare.goto('http://chro-ma.com/minigame')
    // private fields
    this._nextTickCbs = []
    this._gameEndCbs = []
  }

  _init () {
    this.gameDatas = {
      pixelPositions: {
        player: undefined,
        enemies: [],
        bullets: []
      },
      metadatas: {
        hp: 250,
        enemiesCount: 0,
        score: 0
      }
    }
    this.gameState = GameAPI.GAME_STATES.Over
  }

  startNewGame () {
    this._init()
    this.gameState = GameAPI.GAME_STATES.Playing
    return this.nightmare.wait('#start').click('#start').wait('.avatar-deimos-asset')
  }

  readGame () {
    // check if playing
    if (this.gameState === GameAPI.GAME_STATES.Over) {
      return new Promise(resolve => resolve(true))
    }
    return this.nightmare
      // get raw datas from stringified function
      .evaluate(_getGameDatasProxy)
      .then(({ transforms, metadatas }) => {
        // update instance's datas
        this.gameDatas.metadatas = metadatas
        if (this.gameDatas.metadatas.hp <= 0) {
          // game over
          this.gameState = GameAPI.GAME_STATES.Over
          _dispatch(this._gameEndCbs)
          return true
        } else {
          // player
          this.gameDatas.pixelPositions.player = GameAPI.getPixelsFromTranslate(transforms.player)
          // enemies
          for (let i = 0, l = transforms.enemies.length; i < l ; i++) {
            this.gameDatas.pixelPositions.enemies.push(GameAPI.getPixelsFromTranslate(transforms.enemies[i]))
          }
          // bullets
          for (let i = 0, l = transforms.bullets.length; i < l ; i++) {
            this.gameDatas.pixelPositions.bullets.push(GameAPI.getPixelsFromTranslate(transforms.bullets[i]))
          }
          _dispatch(this._nextTickCbs)
          return false
        }
      })
  }

  nextTick (cb) {
    this._nextTickCbs.push(cb)
  }

  onGameEnd (cb) {
    this._gameEndCbs.push(cb)
  }
}

GameAPI.GAME_STATES = { Playing: 0, Over: 1 }

module.exports = GameAPI
