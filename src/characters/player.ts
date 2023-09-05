import 'phaser';
import Phaser from 'phaser';
import { NavKeys } from '../types/KeyboardState';

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
  }

  public getBody() {
    return this.body;
  }

  public update(
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin | null,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
  ) {
    if (keyboard?.checkDown(this.cursors.left, 100)) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x - 64,
        this.body.y,
        true,
      );
      if (tile?.index === -1) {
        this.body.x -= 64;
        this.body.anims.play('left', true);
      }
    } else if (keyboard?.checkDown(this.cursors.right, 100)) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x + 64,
        this.body.y,
        true,
      );
      if (tile?.index === -1) {
        this.body.x += 64;
        this.body.anims.play('right', true);
      }
    } else if (keyboard?.checkDown(this.cursors.up, 100)) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x,
        this.body.y - 64,
        true,
      );
      if (tile?.index === -1) {
        this.body.y -= 64;
        this.body.anims.play('up', true);
      }
    } else if (keyboard?.checkDown(this.cursors.down, 100)) {
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
    }
  }
}
