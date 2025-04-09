
// 

export async function modal_struction({newSQL}){


    const prompt = `
주어진 트리 initialTree와 새 SQL 쿼리 및 설명을 기반으로 트리를 수정하세요.
새쿼리및 설명은 newSql[data]부분을 보면된다.

규칙:
1. 새 SQL이 기존 노드의 결과를 사용하면 해당 노드의 children에 추가
2. 의존하지 않으면 '1'의 children에 추가
3. 기존 노드 구조(id, name 등)는 그대로, children만 수정정

initialTree:
\`\`\`json
${initialTree}
\`\`\`

New SQL:
\`\`\`sql
${newSQL}
\`\`\`



결과: 수정된 전체 initialTree (children 업데이트 + 새 노드 추가)
`; 


const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "당신은 SQL 전문가입니다." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    }),
  });
  
  const dataResponse = await response.json();
  return dataResponse
}