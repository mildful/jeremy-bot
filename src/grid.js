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
    this._currentPlayerPos = { x: null, y: null }
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
    if (gameObject === Grid.GAME_OBJECTS.Player) {
      this._currentPlayerPos = { x, y }
    }
    if (this.vgrid.isInXRange(x) && this.vgrid.isInYRange(y)) {
      this.vgrid.set(gameObject, x, y)
    }
  }

  getProximityGrid (size) {
    let grid = []
    const playerIndex = this.vgrid.index(this._currentPlayerPos.x, this._currentPlayerPos.y)

    // left out rows
    const relativeGridStartX = this._currentPlayerPos.x - size
    const leftOutRows = relativeGridStartX < 0 ? Math.abs(relativeGridStartX) : 0
    // right out rows
    let rightOutRows = (this._currentPlayerPos.x + size) - this.rows
    if (rightOutRows < 0) rightOutRows = 0

    const pushRowIntoArray = (dest, start) => {
      let end = start + (size * 2) + 1 // one for player
      // shift start index to the right depending on leftOutRows
      start += leftOutRows
      // shift end index to the left depending on leftOutRows
      end -= rightOutRows
      if (leftOutRows > 0) {
        dest.push(...new Array(leftOutRows).fill(Grid.GAME_OBJECTS.Void))
      }
      if (rightOutRows > 0) {
        dest.push(...new Array(rightOutRows).fill(Grid.GAME_OBJECTS.Void))
      }
      dest.push(...this.vgrid.grid.slice(start, end))
    }
    const fillWithVoidRows = (dest, nbRows) => {
      dest.push(...new Array((nbRows * size * 2) + 2).fill(Grid.GAME_OBJECTS.Void))
    }

    // upper rows
    let topOutRows = (this._currentPlayerPos.y + size) - this.rows
    if (topOutRows > 0) {
      fillWithVoidRows(grid, topOutRows)
    } else {
      // reset topOutRows because it is used for the loop
      topOutRows = 0
    }
    for (let i = topOutRows; i < size; i++) {
      const start = this.vgrid.finder(playerIndex).up(size - i).left(size).get()
      pushRowIntoArray(grid, start)
    }
    // player row
    {
      const start = this.vgrid.finder(playerIndex).left(size).get()
      pushRowIntoArray(grid, start)
    }
    // lower rows
    /*
    P : { x: 4, y: 1 }
    size : 2
    bottomOutRows : 1

    x   0   1   2   3   4   5   6   7   8
    5   .   .   .   .   .   .   .   .   .
    4   .   .   .   .   .   .   .   .   .
    3   .   .   x   x   x   x   x   .   .
    2   .   .   x   x   x   x   x   .   .
    1   .   .   x   x   P   x   x   .   .
    0   .   .   x   x   x   x   x   .   .
    -1  .   .   x   x   x   x   x   .   .  <= bottom out rows
    -2  .   .   .   .   .   .   .   .   .
    -3  .   .   .   .   .   .   .   .   .
    */
    let bottomOutRows = size - this._currentPlayerPos.y
    if (bottomOutRows > 0) {
      fillWithVoidRows(grid, bottomOutRows)
    } else {
      bottomOutRows = 0
    }
    for (let i = bottomOutRows; i < size; i++) {
      const start = this.vgrid.finder(playerIndex).down(size - i).left(size).get()
      pushRowIntoArray(grid, start)
    }

    return grid
  }
}

Grid.GAME_OBJECTS = { Void: 0, Player: .3, Enemy: .6, Bullet: 1 }

module.exports = Grid
