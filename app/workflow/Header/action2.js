async function modal_struction(text_description,Start_number,rootNode){
    const systemPrompt = `
    
당신은 SQL 분석 및 시각화 전문가입니다.

아래에 제공하는 SQL 문장을 **절 (clause) 단위로 세밀하게 분리**하고,  
**절 간의 흐름(의존 관계)** 을 분석하여 **React Flow**에서 사용할 수 있는 **노드(node)** 와 **엣지(edge)** 리스트를 JSON 형태로 출력하세요.

## 출력 규칙
1. 각 노드는 다음 정보를 포함해야 합니다:
    - id: 노드 고유 번호 (문자열, "1", "2", "3", ...)
    - name: 노드 이름 (예: "Select", "From", "Join", "Group By", "Filter", "Alias")
    - data: 해당 절에서 수행하는 주요 SQL 작업 설명
    - position: { "x": 정수, "y": 정수 }
      - 메인쿼리는 x=0, y는 절차적 흐름에 따라 150씩 증가
      - 서브쿼리는 x=300, y는 절차적 흐름에 따라 150씩 증가
2. 각 엣지는 다음 정보를 포함해야 합니다:
    - source: 출발 노드 id
    - target: 도착 노드 id

## 절 분리 세부 규칙
- FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY는 각각 반드시 분리된 노드로 만듭니다.
- SELECT 절은 최종 노드로 생성합니다.
- Subquery(서브쿼리)가 등장할 경우:
    - 서브쿼리 내부를 따로 트리처럼 분리합니다.
    - 서브쿼리 결과는 외부 쿼리와 연결합니다.
    - 서브쿼리는 x축을 +300px 이동하여 오른쪽에 배치합니다.
- Alias(별칭, AS 키워드)는 별도의 노드로 명시합니다.
- Group By → Filter → Join → Select 순서 흐름을 명확히 보장합니다.
- JOIN은 어떤 테이블끼리 어떤 조건으로 연결하는지를 반드시 data에 명시합니다.

## 출력 포맷
- "nodes": [노드 배열]
- "edges": [엣지 배열]

**JSON 형태로 출력**합니다. 코드블록(\`\`\`json) 안에 작성하세요.

---

## 참고 예시

### 예시 SQL 문장

SELECT d.department_name, e.employee_name  
FROM departments d  
JOIN employees e ON d.department_id = e.department_id  
WHERE d.location_id = 1700  
ORDER BY d.department_name;

### 기대하는 출력

{
  "nodes": [
    { "id": "1", "name": "FROM departments", "data": "departments 테이블을 'd'로 별칭", "position": { "x": 0, "y": 0 } },
    { "id": "2", "name": "FROM employees", "data": "employees 테이블을 'e'로 별칭", "position": { "x": 300, "y": 0 } },
    { "id": "3", "name": "Inner Join", "data": "d.department_id = e.department_id로 조인", "position": { "x": 150, "y": 150 } },
    { "id": "4", "name": "Filter", "data": "d.location_id = 1700", "position": { "x": 150, "y": 300 } },
    { "id": "5", "name": "Order By", "data": "d.department_name 오름차순 정렬", "position": { "x": 150, "y": 450 } },
    { "id": "6", "name": "Select", "data": "d.department_name, e.employee_name 선택", "position": { "x": 150, "y": 600 } }
  ],
  "edges": [
    { "source": "1", "target": "3" },
    { "source": "2", "target": "3" },
    { "source": "3", "target": "4" },
    { "source": "4", "target": "5" },
    { "source": "5", "target": "6" }
  ]
}

---

📢 반드시 위 포맷에 맞춰 출력하고, 코드블록(\`\`\`) 안에 JSON을 작성하세요.


`
//const response = await fetch("https://api.openai.com/v1/chat/completions", {
//    method: "POST",
//    headers: {
//      "Content-Type": "application/json",
//      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//    },
//    body: JSON.stringify({
//      model: "gpt-4o",
//      messages: [
//        { role: "system", content: "당신은 SQL 전문가입니다. 자연어 요청에 대해 정확한 nySQL을 생성하세요. 데이터는 다음은 종합병원에 속한 의사 정보를 담은 DOCTOR 테이블입니다. DOCTOR 테이블은 다음과 같으며 DR_NAME, DR_ID, LCNS_NO, HIRE_YMD, MCDP_CD, TLNO는 각각 의사이름, 의사ID, 면허번호, 고용일자, 진료과코드, 전화번호를 나타냅니다. 설명은 제외하고 sql 만 만들어주세요 "  },
//        { role: "user", content: text_description }
//      ],
//      temperature: 0.1,
//    }),
//  });
//  
//  console.log(response, text_description)
  //const dataResponse = await response.json();

 // const sqlQuery = dataResponse.choices[0].message.content
//
  const response2 = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },  // 앞에서 만든 트리 분석용 프롬프트
        { role: "user", content: text_description }
      ],
      temperature: 0,
    }),
  });
  const dataResponse2 = await response2.json();
  const sqlQuery2 = dataResponse2.choices[0].message.content;

  let parsedData;
  try {
    const jsonMatch = sqlQuery2.match(/```json([\s\S]*?)```/); // ```json ... ``` 블록 찾기
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[1].trim());
    } else {
      parsedData = JSON.parse(sqlQuery2.trim());
    }
  } catch (e) {
    console.error("JSON 파싱 실패:", e);
    throw new Error("OpenAI 응답 파싱 실패");
  }
  
  // 여기에서 전체 반환이 아니라 nodes만 반환
  return parsedData.nodes;
 
  }
    
  
  export async function Flow_chat(formData) {
    const productId = formData.get("productId");
    const numbers=  formData.get("numbers")
    
   // console.log("서버에서 받은 productId:", productId);
   // // 여기에 DB 저장, 로직 처리 등 가능
   // console.log("서버에서 받은 productId:", numbers);
  
    
    const response= await modal_struction(productId,numbers)
  
     return response
  
  }