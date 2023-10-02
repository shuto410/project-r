import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Scene = 'map' | 'battle';
export interface SceneState {
  value: Scene;
}

const initialState: SceneState = {
  value: 'map',
};

export const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    switchScene: (state, action: PayloadAction<Scene>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { switchScene } = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
