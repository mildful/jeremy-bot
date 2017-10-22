const blessed = require('blessed');
const contrib = require('blessed-contrib')

class UI {
    constructor (grid) {
        this.screen = blessed.screen()
        this.dataGrid = grid
        // number of grid columns
        this.dataGridCols = grid.vgrid.getFormattedArrays()[0].length
        this.init()
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
}

module.exports = UI
