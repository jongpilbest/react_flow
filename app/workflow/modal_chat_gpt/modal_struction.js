
// 

export async function modal_struction(initialTree,newSQL){

   
       const prompt = `
        [규칙]
        
      1. 새 SQL이 기존 노드의 결과를 사용하는 경우, 해당 노드 ID를 부모로 삼고 children 배열에 새 노드의 ID를 추가하세요.
        - '결과를 사용한다'는 것은 다음 중 **하나 이상**을 만족하는 경우입니다:
          a. 새 SQL의 FROM 절이 기존 노드와 동일한 테이블을 사용하며,
          b. 새 SQL이 기존 노드가 조회한 SELECT 컬럼을 그대로 포함하거나,
          c. 기존 SQL에 정렬, 필터, 그룹화 등의 문법을 **추가한 형태**인 경우입니다 (예: + WHERE, + ORDER BY, + LIMIT 등)
          d. 새 SQL이 기존 SQL의 결과를 **서브쿼리로 감싼 경우** (SELECT ... WHERE IN (SELECT ...))
        2. 의존 관계가 없다면 ID가 '1'인 루트 노드의 children에 새 노드 ID를 추가하세요.
        3. 기존 노드 구조(id, name 등)는 변경하지 않고, children 필드만 업데이트하세요.
        4. 새로운 노드의 data[2]에는 부모 SQL과 자식 SQL 간 문법 차이를 설명하고, 다음과 같은 형식의 예시를 추가하세요: 
           '예시: + WHERE, + ORDER BY, + GROUP BY, + LIMIT, + JOIN, + ON, + IN, + EXISTS, + CASE, + UNION, + ALIAS(AS), + SUBQUERY, + BETWEEN, + LIKE'
        
        [newSQL]
        - data[0]: 새 SQL 쿼리
        - data[1]: 쿼리 설명
        
        반환 형식: 수정된 initialTree 객체"
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
  
     return dataResponse.choices[0].message.content
   }