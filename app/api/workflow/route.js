


import { NextResponse } from 'next/server';
import Graph from './Graph'
import sqlGraph_flow from './NewGraph'


export async function POST(request) {
  const { input_result,id}= await request.json();

  const eventStream = await sqlGraph_flow.invoke(
    {
      messages:[{
        role:"user",
        content:input_result
    }]
    },{
      configurable: { thread_id: id },
    }
  );

  return  NextResponse.json(eventStream); 
}