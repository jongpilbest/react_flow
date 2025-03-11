'use client'

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Database'
import useNodeReducer from './Node_Store'
export default configureStore({
  reducer: {
    db:userReducer,
    node:useNodeReducer  },
})
