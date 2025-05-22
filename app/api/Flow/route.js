// app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req) {
  const { Node ,input_result ,dummy ,sql,nodesArray,sql_query} = await req.json(); // 프론트에서 보낸 사용자 메시지 받기

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
            사용자가 SQL 쿼리 트리(Node)와 자연어 질문(input_result)을 함께 제공할 것입니다. 
            이를 바탕으로 사용자의 질문에 대해 SQL 쿼리 구조를 고려한 답변을 한국어로 작성해 주세요. 
            표나 목록이 필요한 경우 Markdown 포맷을 사용해 주세요. 만약 예시데이터를 알려줘가 요청된다면면, 이때는 
            전체 쿼리는 

${sql_query}

이렇고, 

            절별 노드 트리를 파악하고 ,더미데이터 만을 사용해서.
           현재  ${sql}에 해당하는 결과물을 뽑아줘.꼭!     
            그리고 간단한 설명만 해줘
              **예시 데이터를 보여줄 때는 반드시 Markdown 테이블 형식으로 출력해야 하며, JSON 형식으로는 절대 출력하지 마세요.**  
            `,
  
          },
          {
            role: 'user',
            content: `사용자의 질문은 다음과 같습니다:\n${input_result} .  ### 1️⃣ 전체 SQL 쿼리

${sql_query}



### 2️⃣ 절별 노드 트리 (JSON)
\`\`\`json
${JSON.stringify(nodesArray, null, 2)}
\`\`\`

### 3️⃣ 더미 데이터 (JSON)
\`\`\`json
${JSON.stringify(dummy, null, 2)}
\`\`\``,
          },
        ],
        temperature: 0.1,
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




