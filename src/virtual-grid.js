const _ = require('lodash');

class Finder {
  constructor (cols, rows, startIndex) {
    this.cols = cols
    this.rows = rows
    this.maxIndex = cols * rows
    this.index = startIndex
  }

  isInRange (index) {
    return index >= 0 && index < this.maxIndex
  }

  up (nb) {
    const newIndex = this.index - (this.cols * nb)
    if (this.isInRange(newIndex)) this.index = newIndex
    return this
  }

  down (nb) {
    this.up(-nb)
    return this
  }

  left (nb) {
    const newIndex = this.index - nb
    if (this.isInRange(newIndex)) this.index = newIndex
    return this
  }

  right (nb) {
    this.left(-nb)
    return this
  }

  get () {
    return this.index
  }
}

class VirtualGrid {
  static index (cols, rows, x, y) {
    return cols * (rows - y - 1) + x
  }

  constructor (cols, rows) {
    // private fields
    // public fields
    this.cols = cols
    this.rows = rows
    this.grid = new Array(cols * rows).fill(-1)
  }

  index (x, y) {
    return VirtualGrid.index(this.cols, this.rows, x, y)
  }

  isInXRange (x) {
    return x >= 0 && x <= this.cols
  }

  isInYRange (y) {
    return y >= 0 && y <= this.rows
  }

  set (value, x, y) {
    if (value === undefined) throw new Error('`value` must be defined.')
    this.grid[this.index(x, y)] = value
  }

  get (x, y) {
    if (x < 0 || x > this.cols) throw new Error('`x` is out of range.')
    if (y < 0 || y > this.rows) throw new Error('`y` is out of range.')
    return this.grid[this.index(x, y)]
  }

  getRows () {
    let rows = []
    for (let i = this.rows - 1; i >= 0; i--) {
      const startIndex = this.index(0, i)
      const row = _.slice(this.grid, startIndex, startIndex + this.cols)
      rows.push(row)
    }
    return rows
  }

  reset () {
    this.grid.fill(-1)
  }

  finder (startIndex) {
    return new Finder(this.cols, this.rows, startIndex)
  }
}

module.exports = VirtualGrid