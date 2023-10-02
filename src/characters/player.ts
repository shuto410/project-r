import 'phaser';
import Phaser from 'phaser';
import { NavKeys } from '../types/KeyboardState';
import { MapEvent } from '../scenes/MainScene';
import { Enemy } from './enemy';

export class Player {
  private body!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: NavKeys;
  constructor(body: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.body = body;
  }
  public create(cursors: NavKeys) {
    this.cursors = cursors;

    this.body.setDisplaySize(64, 64);
    this.body.setFrame(52);
    this.body.setBounce(0);
    this.body.setCollideWorldBounds(true);
    this.body.setDepth(1);
  }

  public getBody() {
    return this.body;
  }

  public clean() {
    this.body.removeFromDisplayList();
    this.body.removeFromUpdateList();
  }

  public update(
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin | null,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    staircase: Phaser.Types.Physics.Arcade.SpriteWithStaticBody,
    enemies: Enemy[],
  ): MapEvent | null {
    if (keyboard?.checkDown(this.cursors.A, 100)) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x - 64,
        this.body.y,
        true,
      );
      if (tile?.index === -1) {
        this.body.x -= 64;
        this.body.anims.play('left', true);
      }
    } else if (keyboard?.checkDown(this.cursors.D, 100)) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x + 64,
        this.body.y,
        true,
      );
      if (tile?.index === -1) {
        this.body.x += 64;
        this.body.anims.play('right', true);
      }
    } else if (keyboard?.checkDown(this.cursors.W, 100)) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x,
        this.body.y - 64,
        true,
      );
      if (tile?.index === -1) {
        this.body.y -= 64;
        this.body.anims.play('up', true);
      }
    } else if (keyboard?.checkDown(this.cursors.S, 100)) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x,
        this.body.y + 64,
        true,
      );
      if (tile?.index === -1) {
        this.body.y += 64;
        this.body.anims.play('down', true);
      }
    } else {
      this.body.anims.stop();
      return null;
    }
    if (this.body.x === staircase.x && this.body.y === staircase.y) {
      return { type: 'staircase' };
    }
    const encounteredEnemy = enemies
      .map((enemy) => ({
        id: enemy.getId(),
        x: enemy.getBody().x,
        y: enemy.getBody().y,
      }))
      .find((e) => {
        console.log('enemy x', e.x);
        console.log('enemy y', e.y);
        console.log('p x', this.body.x);
        console.log('p y', this.body.y);

        if (this.body.x === e.x && this.body.y === e.y) {
          return true;
        }
      });
    if (encounteredEnemy) {
      return { type: 'enemy-encounter', enemyId: encounteredEnemy.id };
    }
    return { type: 'moved' };
  }
}
