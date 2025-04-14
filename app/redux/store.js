'use client'


import { configureStore } from '@reduxjs/toolkit';

import useNodeReducer from './Node_Store'
export default configureStore({
  reducer: {
    node:useNodeReducer  },
})
