const _ = require('lodash');

class VirtualGrid {
  static index (cols, x, y) {
    return x + (cols * y)
  }

  constructor (cols, rows) {
    // private fields
    // public fields
    this.cols = cols
    this.rows = rows
    this.grid = new Array(cols * rows).fill(-1)
  }

  index (x, y) {
    return VirtualGrid.index(this.cols, x, y)
  }

  set (x, y, value) {
    if (value === undefined) throw new Error('`value` must be defined.')
    if (x < 0 || x > this.cols) throw new Error('`x` is out of range.')
    if (y < 0 || y > this.rows) throw new Error('`y` is out of range.')
    this.grid[this.index(x, y)] = value
  }

  get (x, y) {
    if (x < 0 || x > this.cols) throw new Error('`x` is out of range.')
    if (y < 0 || y > this.rows) throw new Error('`y` is out of range.')
    return this.grid[this.index(x, y)]
  }

  getFormattedArrays () {
    let rows = []
    for (let i = 0; i < this.rows; i++) {
      const row = _.slice(this.grid, this.index(0, i), this.cols)
      rows.push(row)
    }
    return rows
  }
}

module.exports = VirtualGrid