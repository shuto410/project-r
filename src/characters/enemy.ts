import 'phaser';
import Phaser from 'phaser';

export class Enemy {
  private id!: number;
  private body!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  constructor(
    body: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    id: number,
  ) {
    this.id = id;
    this.body = body;
  }
  public create() {
    this.body.setDisplaySize(64, 64);
    this.body.setFrame(73);
    this.body.setBounce(0);
    this.body.setCollideWorldBounds(true);
    this.body.setDepth(1);
  }

  public getId() {
    return this.id;
  }

  public getBody() {
    return this.body;
  }

  public clean() {
    this.body.removeFromDisplayList();
    this.body.removeFromUpdateList();
  }

  public update(groundLayer: Phaser.Tilemaps.TilemapLayer): void {
    const direction = Math.floor(Math.random() * 5);
    if (direction === 0) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x - 64,
        this.body.y,
        true,
      );
      if (tile?.index === -1) {
        this.body.x -= 64;
      }
    } else if (direction === 1) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x + 64,
        this.body.y,
        true,
      );
      if (tile?.index === -1) {
        this.body.x += 64;
      }
    } else if (direction === 2) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x,
        this.body.y - 64,
        true,
      );
      if (tile?.index === -1) {
        this.body.y -= 64;
      }
    } else if (direction === 3) {
      const tile = groundLayer.getTileAtWorldXY(
        this.body.x,
        this.body.y + 64,
        true,
      );
      if (tile?.index === -1) {
        this.body.y += 64;
      }
    } else {
      return;
    }
    return;
  }
}
