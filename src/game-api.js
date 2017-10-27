class GameAPI {
  static getPixelsFromTranslate (str) {
    const regex = /(\d+)px/g
    const x = +regex.exec(str)[1]
    const y = +regex.exec(str)[1]
    return { x, y }
  }

  static getGameDatas () {
    const datas = {
      pixelPositions: {
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
    datas.pixelPositions.player = GameAPI.getPixelsFromTranslate(document.getElementsByClassName('avatar-deimos-asset')[0].style.transform)
    // enemies
    const enemies = document.getElementsByClassName('monster-deimos-asset')
    for (let i = 0, l = enemies.length; i < l ; i++) {
      datas.pixelPositions.enemies.push(GameAPI.getPixelsFromTranslate(enemies[i].style.transform))
    }
    // bullets
    const bullets = document.querySelectorAll('[id^=projectile]')
    for (let i = 0, l = bullets.length; i < l ; i++) {
      datas.pixelPositions.bullets.push(GameAPI.getPixelsFromTranslate(bullets[i].style.transform))
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

module.exports = GameAPI
