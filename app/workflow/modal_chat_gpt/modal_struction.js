
// 

export async function modal_struction(initialTree,newSQL){

   
       const prompt = `
   주어진 트리 initialTree와 newSQL 쿼리 및 설명을 기반으로 트리를 수정하세요.
   newSQL 객체의 data[0]에는 SQL 쿼리, data[1]에는 설명이 들어있습니다.
   
   규칙:
   1. 새 SQL이 기존 노드의 결과를 사용하면 해당 노드의 children에 추가
   2. 의존하지 않으면 '1'의 children에 추가
   3. 기존 노드 구조(id, name 등)는 그대로, children만 수정
   4. 부모 SQL과 자식 SQL의 문법 차이를 간단히 비교하여 data[2]에 추가 
     4-1 : "예시: 4 : "예시: + WHERE, + ORDER BY, + GROUP BY, + HAVING, + LIMIT, + JOIN, + ON, + SELECT , + IN, + EXISTS, + CASE, + UNION, + ALIAS(AS), + SUBQUERY, + BETWEEN, + LIKE"

   initialTree:
   \`\`\`json
   ${JSON.stringify(initialTree, null, 2)}
   \`\`\`
   
   New SQL:
   \`\`\`sql
   ${JSON.stringify(newSQL, null, 2)}
   \`\`\`
   
   
   
   결과: 변경된 노드만 반환해주세요.
   주의: 설명은 생략하고, 변경돤 노드만 JSON 객체으로로 출력하세요. 코드 블록(\`\`\`)도 없이 JSON만 출력해주세요.
   `; 
   
   
   const response = await fetch("https://api.openai.com/v1/chat/completions", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
       },
       body: JSON.stringify({
         model: "gpt-4o",
         messages: [
           { role: "system", content: "당신은 SQL 쿼리 간의 상속 및 의존 관계를 분석하여 트리 구조로 변환하는 트리 구성 전문가입니다. 주어진 SQL 쿼리가 기존 트리 노드에 의존하는지 분석한 후, 적절한 위치에 새로운 노드를 삽입하는 것이 당신의 역할입니다. 기존 노드 구조는 유지하고, children 필드만 업데이트하세요. "},
           { role: "user", content: prompt },
         ],
         temperature: 0.5,
       }),
     });
     
     const dataResponse = await response.json();
     console.log(dataResponse.choices[0].message.content,'??????')
     return dataResponse.choices[0].message.content
   }