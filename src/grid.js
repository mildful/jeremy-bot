const VirtualGrid = require('./virtual-grid')

class Grid {
  static getPixelsFromTranslate (str) {
    const regex = /(\d+)px/g
    const x = +regex.exec(str)[1]
    const y = +regex.exec(str)[1]
    return { x, y }
  }

  /**
   * Instanciate a grid
   * @param {number} cols
   * @param {number} rows
   * @param {number} width
   * @param {number} height
   * @param {{debug: boolean}} options
   */
  constructor (cols, rows, width, height, options) {
    // private fields
    this._debug = !!options.debug
    this._xSize = width / cols
    this._ySize = height / rows
    // public fields
    this.vgrid = new VirtualGrid(cols, rows)
    this.cols = cols
    this.rows = rows
  }

  calcCoordsFromPixels (px, isHeight = null) {
    // WARNING : there is no check on isHeight because I'm not suppose to edit this without knowing
    // what I'm doing. isHeight MUST BE EXPLICITLY SET TO A VALID BOOLEAN VALUE
    const cellSize = isHeight ? this._ySize : this._xSize
    return Math.ceil(px / cellSize)
  }

  evalRawTransforms ({ player, enemies, bullets }) {
    this.vgrid.reset()
    this.evalRawTransform(Grid.GAME_OBJECTS.Player, player)
    enemies.forEach(enemy => this.evalRawTransform(Grid.GAME_OBJECTS.Enemy, enemy))
    bullets.forEach(bullet => this.evalRawTransform(Grid.GAME_OBJECTS.Bullet, bullet))
  }

  evalRawTransform (gameObject, transform) {
    const pixels = Grid.getPixelsFromTranslate(transform)
    this.vgrid.set(
      gameObject,
      this.calcCoordsFromPixels(pixels.x, false),
      this.calcCoordsFromPixels(pixels.y, true)
    )
  }
}

Grid.GAME_OBJECTS = { Player: 0, Enemy: 1, Bullet: 2 }

module.exports = Grid
