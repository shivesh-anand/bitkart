import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { apiSlice } from "./api/apiSlice";
import { itemApi } from "./api/itemSlice";
import { userApi } from "./api/userSlice";
import authReducer from "./slices/authSlice";
import storage from "./storage";

const rootReducer = combineReducers({
  auth: authReducer,
  [itemApi.reducerPath]: itemApi.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, itemApi.middleware, userApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
