import Phaser from 'phaser'
// import Game from './scenes/Game'
// import Background from './scenes/Background'
// import Bootstrap from './scenes/Bootstrap'
import MainScene from './scenes/MainScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#244440',
  pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  autoFocus: true,
  // scene: [Bootstrap, Background, Game],
  scene: [MainScene],
}

const phaserGame = new Phaser.Game(config)

;(window as any).game = phaserGame

export default phaserGame
