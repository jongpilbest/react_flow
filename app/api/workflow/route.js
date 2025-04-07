

import { LangChainAdapter } from 'ai';
import { NextResponse } from 'next/server';
import Graph from './Graph'


// 이건뭐임?


export async function POST(request) {
  const { input }= await request.json();


  const eventStream = await Graph.invoke(
    {
      messages:[{
        role:"user",
        content:input
    }]
    },{
      configurable: { thread_id: '1' },
    }
  );

  return  NextResponse.json(eventStream); 
}
