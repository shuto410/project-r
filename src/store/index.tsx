import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './features/counter';
import { mapReducer } from './features/map';
import { sceneReducer } from './features/scene';
import { battleReducer } from './features/battle';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    map: mapReducer,
    scene: sceneReducer,
    battle: battleReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
