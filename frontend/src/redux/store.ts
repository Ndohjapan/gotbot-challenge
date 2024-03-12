import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import menuSlice from "./slices/menuSlice";
import categorySlice from "./slices/categorySlice";
import foodItemSlice from "./slices/foodItemSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  menu: menuSlice.reducer,
  category: categorySlice.reducer,
  food: foodItemSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    whitelist: ["auth"],
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
