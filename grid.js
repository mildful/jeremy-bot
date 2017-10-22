const _ = require('lodash');

class VirtualGrid {
    static index (x, y) {
        return x * (y + 1)
    }

    constructor (cols, rows) {
        // private fields
        this._cols = cols
        this._rows = rows
        // public fields
        this.grid = new Array(cols * rows).fill(-1)
    }

    set (x, y, value) {
        if (value === undefined) throw new Error('`value` must be defined.')
        if (x < 0 || x > this._cols) throw new Error('`x` is out of range.')
        if (y < 0 || y > this._rows) throw new Error('`y` is out of range.')
        this.grid[VirtualGrid.index(x, y)] = value
    }

    get (x, y) {
        if (x < 0 || x > this._cols) throw new Error('`x` is out of range.')
        if (y < 0 || y > this._rows) throw new Error('`y` is out of range.')
        return this.grid[VirtualGrid.index(x, y)]
    }
    
    getFormattedArrays () {
        let rows = []
        for (let i = 0; i < this._rows; i++) {
            const row = _.slice(this.grid, VirtualGrid.index(0, i), this._cols)
            rows.push(row)
        }
        return rows
    }
}

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

    evalRawTransforms ({ player, enemies, bullets }) {
        this.vgrid.set(10, 12, Grid.GAME_OBJECTS.Player)
        this.computePlayerTransform(player)
    }

    computePlayerTransform (transform) {
        // console.log(transform)
    }
}

Grid.GAME_OBJECTS = { Player: 0, Enemy: 1, Bullet: 2 }
Grid.getRawTransforms = function () {
    const transforms = {
        player: undefined,
        enemies: [],
        bullets: []
    }
    // player
    transforms.player = document.getElementsByClassName('avatar-deimos-asset')[0].style.transform
    // enemies
    const enemies = document.getElementsByClassName('monster-deimos-asset')
    for (let i = 0, l = enemies.length; i < l ; i++) {
        transforms.enemies.push(enemies[i].style.transform)
    }
    // bullets
    const bullets = document.querySelectorAll('[id^=projectile]')
    for (let i = 0, l = bullets.length; i < l ; i++) {
        transforms.bullets.push(bullets[i].style.transform)
    }
    console.log(transforms)
    return transforms
}

module.exports = Grid
