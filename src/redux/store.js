import { configureStore } from '@reduxjs/toolkit';
import salesReducer from './reducer';

const store = configureStore({
  reducer: {
    sales: salesReducer,
  },
 
});

export default store;