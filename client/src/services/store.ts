import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import authReducer from "./authSlice";
import rootSaga from "./sagas"; // You will create this to handle your sagas

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Root reducer combining all slices
const rootReducer = combineReducers({
  auth: authReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure the store with the saga middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware), // Add the saga middleware here
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Persistor for redux-persist
export const persistor = persistStore(store);

// Types for dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
