const BrowserAPI = {
  getBrowserDatas: function () {
    const datas = {
      transforms: {
        player: undefined,
        enemies: [],
        bullets: []
      },
      metadatas: {
        hp: null,
        enemiesCount: 0,
        score: 0
      }
    }

    // player
    datas.transforms.player = document.getElementsByClassName('avatar-deimos-asset')[0].style.transform
    // enemies
    const enemies = document.getElementsByClassName('monster-deimos-asset')
    for (let i = 0, l = enemies.length; i < l ; i++) {
      datas.transforms.enemies.push(enemies[i].style.transform)
    }
    // bullets
    const bullets = document.querySelectorAll('[id^=projectile]')
    for (let i = 0, l = bullets.length; i < l ; i++) {
      datas.transforms.bullets.push(bullets[i].style.transform)
    }

    // hp
    datas.metadatas.hp = parseInt(document.getElementById('hp-bar-current').style.width)
    //enemis count
    datas.metadatas.enemiesCount = enemies.length
    // score
    const timeStr = document.getElementById('game-timer').textContent.split(':')
    datas.metadatas.score = timeStr[0] * 60 + parseFloat(timeStr[1])

    return datas
  }
}

module.exports = BrowserAPI
