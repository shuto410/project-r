import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PlayerStatusState {
  hp: number;
  attack: number;
  defense: number;
  level: number;
  exp: number;
}

const initialState: PlayerStatusState = {
  hp: 100,
  attack: 50,
  defense: 50,
  level: 1,
  exp: 0,
};

export const playerStatusSlice = createSlice({
  name: 'player-status',
  initialState,
  reducers: {
    reduceHp: (state, action: PayloadAction<number>) => {
      state.hp -= action.payload;
    },
    addExp: (state, action: PayloadAction<number>) => {
      state.exp += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { reduceHp, addExp } = playerStatusSlice.actions;

export const playerStatusReducer = playerStatusSlice.reducer;
