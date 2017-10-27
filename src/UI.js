const blessed = require('blessed');
const contrib = require('blessed-contrib')
const _ = require('lodash')

class UI {
  constructor (grid, blessedEnable = true) {
    this.dataGrid = grid
    // number of grid columns
    this.dataGridCols = grid.vgrid.getRows()[0].length
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
    const grid = this.dataGrid.vgrid.getRows()

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
    const linizer = str => `${str}\r\n`
    let res = ''

    // body
    let body = ''
    // 1-loop way. But redoundant with vgrid.getRooms()
    /*
    const computedGrid = this.dataGrid.vgrid.grid.map(v => cellizer(v.toString()))
    for (let i = this.dataGrid.vgrid.rows; i > 0; i--) {
      const index = this.dataGrid.vgrid.index(0, i)
      const row = _.slice(computedGrid, index, index + this.dataGrid.vgrid.cols)
      body += linizer(cellizer(i.toString()) + row.join(''))
    }
    */
    // 2-loops way. Using vgrid.getRows()
    this.dataGrid.vgrid.getRows().forEach((row, index, rows) => {
      let strRow = row.map(v => cellizer(v.toString()))
      body += linizer(cellizer(`${rows.length - 1 - index}`) + strRow.join(''))
    })
    res += body

    // footer
    let footer = cellizer('xxx')
    Array.apply(null, {length: this.dataGridCols})
      .map(Number.call, Number)
      .forEach(strIndex => footer += cellizer(strIndex.toString()))
    res += linizer(footer)

    return res
  }
}

module.exports = UI
