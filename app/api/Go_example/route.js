// app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req) {
  const { Node ,input_result ,dummy} = await req.json(); // 프론트에서 보낸 사용자 메시지 받기

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
        model: 'gpt-4o', // 또는 'gpt-4', 'gpt-3.5-turbo'
        messages: [
          {
            role: 'system',
            content: `당신은 친절한 SQL 어시스턴트입니다.
    ${dummy} 데이터를 활용해서 알려주세요 적절한 예시를 알알려주세요.  `,
  
          },
          {
            role: 'user',
            content: `다음은 SQL 쿼리 트리입니다:\n${JSON.stringify(Node, null, 2)}\n\n사용자의 현재 쿼리는 :\n${sql} 더미데이터는 ${dummy}입니다.`,
          },
        ],
        temperature: 0.5,
        stream: true, // 🔥 스트리밍 응답 요청
      }),
  });

  // OpenAI 응답 스트림을 그대로 프론트로 전달
  const stream = openaiRes.body;

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream', // 스트리밍
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
    },
  });
}




