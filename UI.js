const blessed = require('blessed');
const contrib = require('blessed-contrib')

class UI {
    constructor (grid) {
        this.screen = blessed.screen()
        this.dataGrid = grid
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
            columnSpacing: 10,
            columnWidth: [12, 12]
        })
        this.uiGrid.setData({
            headers: [],
            data: []
        })

        this.screen.render()
    }

    render () {
        // update grid
        //this.dataGrid.vgrid.getArray()
        this.screen.render()
    }
}

module.exports = UI
