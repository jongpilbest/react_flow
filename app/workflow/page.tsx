'use client';

import React from 'react'
import Editor from './_components/Editor'
import Store  from '../redux/store'
import { Provider } from 'react-redux';

export default function page() {
  return (
    <Provider store={Store}>
      <Editor></Editor>
      </Provider>
     
  )
}
