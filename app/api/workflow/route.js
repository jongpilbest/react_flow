


import { NextResponse } from 'next/server';
import Graph from './Graph'
import sqlGraph_flow from './NewGraph'

// 이건뭐임?

export async function POST(request) {
  const { input_result,id }= await request.json();
  const user_id = "1";

  const eventStream = await sqlGraph_flow.invoke(
    {
      messages:[{
        role:"user",
        content:input_result
    }]
    },{
      configurable: { thread_id: id,user_id },
    }
  );

  return  NextResponse.json(eventStream); 
}