// app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req) {
  const { input_result , real_sql } = await req.json(); // 프론트에서 보낸 사용자 메시지 받기

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `당신은 SQL 어시스턴트 입니다. 적당한 Dummy 데이터를 만들어주세요..
            
            아래 SQL 쿼리를 실행할 수 있도록, 필요한 모든 테이블에 대한 더미 데이터를 JSON 형식으로 생성해주세요.

            요구 사항:
           
             사용자가 SQL 쿼리의 절(clause) 구조를 노드 기반(JSON)으로 제공합니다.  
             당신의 작업은 다음과 같습니다:
             
             1. 노드 정보들을 분석하여 필요한 테이블과 컬럼들을 추출하세요.
             2. JOIN, WHERE, FILTER, SUB QUERY 등의 조건을 파악하세요.
             3. 조건을 충족하고 최종 SELECT 결과가 반드시 1개 이상 나올 수 있도록 더미 데이터를 설계하세요.
             4. 각 테이블은 최소 5개 이상의 행을 포함해서 쿼리 결과가 나오게 만들어주세요 .
             5. 결과는 JSON만 출력하세요. 구조 예시는 다음과 같습니다:

            
            4. 설명 없이 , 코드 블록 없이  JSON만 반환해주세요.
            `,
          },
          {
            role: 'user',
            content: `SQL을 절 단위로 나눈 트리 구조는 다음과 같습니다: :\n${JSON.stringify(input_result, null, 2)} 사용자의 전체 SQL 쿼리는 다음과 같습니다: ${real_sql}`,
          },
        ],
        temperature: 0.2,
        stream: false, // 🔥 스트리밍 응답 요청
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




