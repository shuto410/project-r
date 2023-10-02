import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type FloorKey = `${number}`;

export type MapsInfo = Record<FloorKey, MapInfo>;

export type MapInfo = {
  staircase: {
    x: number;
    y: number;
  };
};

export interface MapState {
  floorKey: FloorKey;
  mapsInfo: MapsInfo;
}

const initialState: MapState = {
  floorKey: '1',
  mapsInfo: {
    '1': {
      staircase: {
        x: 6,
        y: 2,
      },
    },
    '2': {
      staircase: {
        x: 6,
        y: 2,
      },
    },
    '3': {
      staircase: {
        x: 6,
        y: 2,
      },
    },
  },
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setFloor: (state, action: PayloadAction<FloorKey>) => {
      state.floorKey = action.payload;
    },
    setNextFloor: (state) => {
      state.floorKey = `${Number.parseInt(state.floorKey) + 1}`;
    },
    setStaircasePosition: (
      state,
      action: PayloadAction<{
        floorKey: FloorKey;
        position: { x: number; y: number };
      }>,
    ) => {
      state.mapsInfo[action.payload.floorKey] = {
        staircase: action.payload.position,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFloor, setNextFloor, setStaircasePosition } =
  mapSlice.actions;

export const mapReducer = mapSlice.reducer;
