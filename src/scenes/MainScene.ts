import 'phaser';
import { RootState, store } from '../store';
import Phaser from 'phaser';
import { Keyboard, NavKeys } from '../types/KeyboardState';
import { Player } from '../characters/player';
import { FloorKey, setNextFloor } from '../store/features/map';
import { Enemy } from '../characters/enemy';
import { switchScene } from '../store/features/scene';
import { setEnemies } from '../store/features/battle';

const LAYER_WIDTH = 64 * 1 * 12;
const LAYER_HEIGHT = 64 * 1 * 12;
class MainScene extends Phaser.Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private cursors!: NavKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private groundTiles!: Phaser.Tilemaps.Tileset;
  private staircase!: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private state!: RootState;
  private previousState!: RootState;
  constructor() {
    super({
      key: 'Main',
    });
  }

  preload(): void {
    this.load.spritesheet('tile', 'src/assets/sokoban_tilesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.loadMap('1', 'src/assets/map.json');
    this.loadMap('2', 'src/assets/map2.json');
    this.loadMap('3', 'src/assets/map3.json');
  }

  create(): void {
    this.state = store.getState();
    this.previousState = this.state;
    this.cursors = {
      ...this.input!.keyboard!.createCursorKeys(),
      ...(this.input!.keyboard!.addKeys('W,S,A,D') as Keyboard),
    };
    this.createAnimation();
    this.setMap(this.state.map.floorKey);

    this.physics.world.bounds.width = this.groundLayer.displayWidth;
    this.physics.world.bounds.height = this.groundLayer.displayHeight;
    this.cameras.main.setBounds(
      0,
      0,
      this.physics.world.bounds.width,
      this.physics.world.bounds.height,
    );
  }

  update(): void {
    this.state = store.getState();
    console.log(this.state.scene.value);
    this.onChangeState(
      (state: RootState) => state.map.floorKey,
      () => this.setMap(this.state.map.floorKey),
    );
    this.onChangeState(
      (state: RootState) => state.scene.value,
      (state: RootState) => {
        if (state.scene.value === 'battle') {
          this.scene.switch('Battle');
          store.dispatch(switchScene('battle'));
        }
      },
    );
    const mapEvent = this.player.update(
      this.input?.keyboard,
      this.groundLayer,
      this.staircase,
      this.enemies,
    );
    if (mapEvent?.type === 'staircase') {
      console.log('staircase');
      store.dispatch(setNextFloor());
    } else if (mapEvent?.type === 'moved') {
      console.log('moved');
      this.enemies.forEach((enemy) => enemy.update(this.groundLayer));
    } else if (mapEvent?.type === 'enemy-encounter') {
      console.log('encountered an enemy');
      console.log(mapEvent.enemyId);
      this.scene.switch('Battle');
      store.dispatch(
        setEnemies([
          {
            name: 'dragon',
            id: mapEvent.enemyId,
            status: {
              hp: 100,
              maxHp: 100,
              attack: 50,
              defense: 50,
              level: 10,
            },
          },
        ]),
      );
      store.dispatch(switchScene('battle'));
    }
    this.previousState = this.state;
  }

  private loadMap(mapKey: FloorKey, path: `src/assets/${string}.json`): void {
    this.load.tilemapTiledJSON(mapKey, path);
  }

  private createAnimation(): void {
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('tile', { start: 52, end: 54 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('tile', { start: 55, end: 57 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('tile', { start: 81, end: 83 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('tile', { start: 78, end: 80 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'enemy',
      frames: this.anims.generateFrameNumbers('tile', { start: 73, end: 73 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private addLayer(map: Phaser.Tilemaps.Tilemap, layerId: string): void {
    this.groundLayer = map.createLayer(layerId, this.groundTiles, 0, 0)!;
    this.groundLayer.setDisplaySize(LAYER_WIDTH, LAYER_HEIGHT);
    this.groundLayer.setCollisionByExclusion([-1, 0, 1, 2, 3, 4]);
  }

  private setMap(key: FloorKey): void {
    this.map = this.make.tilemap({ key });
    const groundTiles = this.map.addTilesetImage('tile', 'tile')!;
    if (!groundTiles) {
      console.error('could not add tile set image');
      return;
    }
    this.groundTiles = groundTiles;
    this.addLayer(this.map, 'ground');
    // this.addLayer(this.map, 'staircase');
    this.addLayer(this.map, 'objects');
    this.player?.clean();
    this.player = new Player(this.physics.add.sprite(32 + 64, 64 + 32, 'tile'));
    this.player.create(this.cursors);

    this.enemies.push(
      new Enemy(
        this.physics.add.sprite(32 + 64 * (6 - 1), 32 + 64 * (6 - 1), 'tile'),
        this.enemies.length,
      ),
    );
    this.enemies.forEach((enemy) => enemy.create());

    const staircase = this.state.map?.mapsInfo[key]?.staircase;
    if (staircase) {
      const { x: staircaseX, y: staircaseY } = staircase;
      this.staircase = this.physics.add.staticSprite(
        32 + 64 * (staircaseX - 1),
        32 + 64 * (staircaseY - 1),
        'tile',
        11,
      );
    }
  }

  private onChangeState<ReturnType>(
    selector: (state: RootState) => ReturnType,
    callback: (state: RootState) => void,
  ): void {
    if (selector(this.previousState) !== selector(this.state)) {
      callback(this.state);
    }
  }
}

export type MapEvent =
  | {
      type: 'staircase';
    }
  | {
      type: 'moved';
    }
  | {
      type: 'enemy-encounter';
      enemyId: number;
    };

export default MainScene;
