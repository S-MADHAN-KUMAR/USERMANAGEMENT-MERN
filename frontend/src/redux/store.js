import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage
};

// Combine reducers (if you have multiple reducers, add them here)
const rootReducer = combineReducers({ user: userReducer });

// Apply persistence to the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

// Create a persistor to handle rehydration
export const persistor = persistStore(store);
