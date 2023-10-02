import 'phaser';
import { RootState, store } from '../store';
import Phaser from 'phaser';
// import { Keyboard } from '../types/KeyboardState';
import { switchScene } from '../store/features/scene';
import { clearBattle } from '../store/features/battle';

class BattleScene extends Phaser.Scene {
  private state!: RootState;
  private previousState!: RootState;
  constructor() {
    super({
      key: 'Battle',
    });
  }

  preload(): void {
    this.load.image('bg', 'src/assets/battle_bg.png');
    this.load.image('monster', 'src/assets/monster.png');
    this.load.spritesheet('tile', 'src/assets/sokoban_tilesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create(): void {
    this.state = store.getState();
    // this.cursors = {
    //   ...this.input!.keyboard!.createCursorKeys(),
    //   ...(this.input!.keyboard!.addKeys('W,S,A,D') as Keyboard),
    // };
    // const bg = this.add.image(500, 375, 'bg');
    this.add.image(500, 375, 'bg');
    const monsterImage = this.add.image(500, 375, 'monster');
    monsterImage.setScale(0.45, 0.45);
    console.debug(this.state);

    this.previousState = this.state;
  }

  update(): void {
    this.state = store.getState();
    console.log(this.state.scene.value);
    this.onChangeState(
      (state: RootState) => state.scene.value,
      (state: RootState) => {
        if (state.scene.value === 'map') {
          this.scene.switch('Main');
          this.scene.stop('Battle');
          store.dispatch(clearBattle());
          store.dispatch(switchScene('map'));
        }
      },
    );

    this.previousState = this.state;
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

export default BattleScene;
