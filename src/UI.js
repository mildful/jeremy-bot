const blessed = require('blessed');
const contrib = require('blessed-contrib')
const _ = require('lodash')

class UI {
  constructor (grid, blessedEnable = true) {
    this.dataGrid = grid
    // number of grid columns
    this.dataGridCols = grid.vgrid.getFormattedArrays()[0].length
    if (blessedEnable) {
      this.screen = blessed.screen()
      this.init()
    }
  }

  init () {
    this.gridFactory = new contrib.grid({
      rows: 12,
      cols: 6,
      screen: this.screen
    })

    // Build game grid
    this.uiGrid = this.gridFactory.set(0, 0, 12, 6, contrib.table, {
      label: 'Virtual Grid',
      fg: 'white',
      align: 'center',
      border: { type: 'line', fg: 'cyan' },
      columnWidth: new Array(this.dataGridCols + 1).fill(3), // +1 is for the first 'header' column added in render()
      columnSpacing: 2,
    })
    this.uiGrid.setData({
      headers: [],
      data: []
    })

    this.screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0))

    this.screen.render()
  }

  render () {
    // update grid
    const grid = this.dataGrid.vgrid.getFormattedArrays()

    this.uiGrid.setData({
      headers: ['O', ...Array.apply(null, {length: this.dataGridCols}).map(Number.call, Number)],
      data: grid.map((arr, i) => {
        arr.unshift(i)
        return arr
      })
    })

    this.screen.render()
  }

  getStringGrid () {
    const threezer = str => str.length >= 3 ? str : new Array(3 + 1 - str.length).join(' ') + str
    const cellizer = str => `${threezer(str)} `
    // const linizer = str => `${str}\r\n${new Array(str.length).join('_')}\r\n`
    const linizer = str => `${str}\r\n`
    const grid = this.dataGrid.vgrid.getFormattedArrays()
    let res = ''

    // header
    let header = cellizer('xxx')
    Array.apply(null, {length: this.dataGridCols})
      .map(Number.call, Number)
      .forEach(strIndex => header += cellizer(strIndex.toString()))
    res += linizer(header)

    // body
    let body = ''
    const computedGrid = this.dataGrid.vgrid.grid.map(v => cellizer(v.toString()))
    for (let i = 0, l = this.dataGrid.vgrid.rows; i < l; i++) {
      const index = this.dataGrid.vgrid.index(0, i)
      const row = _.slice(computedGrid, index, index + this.dataGrid.vgrid.cols)
      body += linizer(cellizer(i.toString()) + row.join(''))
    }
    res += body

    return res
  }
}

module.exports = UI
