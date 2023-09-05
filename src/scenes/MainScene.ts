import 'phaser';
import { store } from '../store';
import Phaser from 'phaser';
import { Keyboard, NavKeys } from '../types/KeyboardState';
import { Player } from '../characters/player';

class MainScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: NavKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  constructor() {
    super({
      key: 'Main',
    });
  }

  init(): void {
    console.log('init');
  }

  preload(): void {
    this.load.spritesheet('tile', 'src/assets/sokoban_tilesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.tilemapTiledJSON('map', 'src/assets/map.json');
  }

  create(): void {
    console.log('create');
    const state = store.getState();
    const count = state.counter.value;
    this.text = this.add.text(10, 10, count.toString());
    // this.player = this.physics.add.sprite(20, 20, 'dude');
    this.cursors = {
      ...this.input!.keyboard!.createCursorKeys(),
      ...(this.input!.keyboard!.addKeys('W,S,A,D') as Keyboard),
    };
    this.map = this.make.tilemap({ key: 'map' });
    const groundTiles = this.map.addTilesetImage('tile', 'tile');
    const layerWidth = 64 * 1 * 12;
    const layerHeight = 64 * 1 * 12;
    this.groundLayer = this.map.createLayer('stage', groundTiles!, 0, 0)!;
    this.groundLayer.setDisplaySize(layerWidth, layerHeight);
    this.groundLayer.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = this.groundLayer.displayWidth;
    this.physics.world.bounds.height = this.groundLayer.displayHeight;
    this.cameras.main.setBounds(
      0,
      0,
      this.physics.world.bounds.width,
      this.physics.world.bounds.height,
    );

    this.player = new Player(this.physics.add.sprite(32, 64 + 32, 'tile'));
    this.player.create(this.cursors);

    // 下向きのアニメーション
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('tile', { start: 52, end: 54 }),
      frameRate: 10,
      repeat: -1,
    });
    // 上向きのアニメーション
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('tile', { start: 55, end: 57 }),
      frameRate: 10,
      repeat: -1,
    });

    // 左向きのアニメーション
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('tile', { start: 81, end: 83 }),
      frameRate: 10,
      repeat: -1,
    });
    // 右向きのアニメーション
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('tile', { start: 78, end: 80 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(): void {
    const state = store.getState();
    // const count = state.counter.value;
    this.player.update(this.input?.keyboard, this.groundLayer);
  }
}

export default MainScene;
