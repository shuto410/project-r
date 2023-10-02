import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type EnemyStatus = {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  level: number;
};

export type Enemy = {
  id: number;
  name: string;
  status: EnemyStatus;
};

export interface BattleState {
  enemies: Enemy[];
}

const initialState: BattleState = {
  enemies: [],
};

export const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setEnemies: (state, action: PayloadAction<Enemy[]>) => {
      state.enemies = action.payload;
    },
    reduceEnemyHp: (
      state,
      action: PayloadAction<{ id: number; amount: number }>,
    ) => {
      const targetEnemy = state.enemies.find(
        (enemy) => enemy.id === action.payload.id,
      );
      if (targetEnemy) targetEnemy.status.hp -= action.payload.amount;
    },
    clearBattle: (state) => {
      state.enemies = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEnemies, clearBattle, reduceEnemyHp } = battleSlice.actions;

export const battleReducer = battleSlice.reducer;
