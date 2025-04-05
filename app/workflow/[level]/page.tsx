'use client';


import React from 'react'
import Editor from '../_components/Editor'

import Store  from '../../redux/store'
import { Provider } from 'react-redux';

export default async function Page({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
// level 에 따라서 container 몇개주는지  달라지는거 해야되겠네..ㅎ..

  return (
    <Provider store={Store}>
      <Editor></Editor>
      </Provider>
     
  )
}
