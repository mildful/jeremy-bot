const VirtualGrid = require('./virtual-grid')

class Grid {
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

  calcCoordFromPixels (px, isHeight = null) {
    // WARNING : there is no check on isHeight because I'm not suppose to edit this without knowing
    // what I'm doing. isHeight MUST BE EXPLICITLY SET TO A VALID BOOLEAN VALUE
    const cellSize = isHeight ? this._ySize : this._xSize
    return Math.ceil(px / cellSize)
  }

  evalPixelPositions ({ player, enemies, bullets }) {
    this.vgrid.reset()
    bullets.forEach(bullet => this.evalPixelPosition(Grid.GAME_OBJECTS.Bullet, bullet))
    enemies.forEach(enemy => this.evalPixelPosition(Grid.GAME_OBJECTS.Enemy, enemy))
    this.evalPixelPosition(Grid.GAME_OBJECTS.Player, player)
  }

  evalPixelPosition (gameObject, pixelPosition) {
    const x = this.calcCoordFromPixels(pixelPosition.x, false)
    const y = this.calcCoordFromPixels(pixelPosition.y, true)
    if (this.vgrid.isInXRange(x) && this.vgrid.isInYRange(y)) {
      this.vgrid.set(gameObject, x, y)
    }
  }
}

Grid.GAME_OBJECTS = { Player: 0, Enemy: .5, Bullet: 1 }

module.exports = Grid
