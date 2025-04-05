

import { LangChainAdapter } from 'ai';

import Graph from './Graph'


// 이건뭐임?


export async function POST(request) {
  const { messages }= await request.json();
 //console.log(messages,'?메세지지')

  const eventStream = await Graph.streamEvents(
    {
      messages
    },
    { streamMode: "messages",
      configurable: { thread_id: '1' },
      version: "v2"
    }
  );



  return LangChainAdapter.toDataStreamResponse(eventStream);
}
