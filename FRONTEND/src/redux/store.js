import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

//PERSIST CONFIG -- SAVE REDUX STORE TO LOCAL STORAGE
const persistConfig = {
  key: 'root',
  storage,
}

//PERSIST THE USER REDUCER
const persisted_userReducer = persistReducer(persistConfig, userReducer)

//CREATE STORE
const store = configureStore(
  {
    //REDUCERS
    reducer: {
      user: persisted_userReducer
    },

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  }
)

//CREATE THE STORE PERSISTOR TO SAVE THE STORE IN LOCAL STORAGE
const Persistor = persistStore(store)

export { Persistor };

export default store;
