import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './rootReducer';
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'

// A slice represents a single unit of Redux state. It’s a collection of reducer logic and actions for a single feature in your app, typically defined together in a single file.
const persistedReducer = persistReducer(rootPersistConfig, rootReducer )

export const store = configureStore({
    reducer: 
    {
        [apiSlice.reducerPath]: apiSlice.reducer,
        // The reducerPath is a unique key that your service will be mounted to in your store. If you call createApi more than once in your application, you will need to provide a unique value each time. Defaults to api. A key defining where the Redux store will store the cache

        // A standard redux reducer that enables core functionality
        persistedReducer,
    },
    middleware: getDefaultMiddleware => // allow us to customize the dispatch function
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(apiSlice.middleware),
    devTools: true
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// ----------------------------------------------------------------------