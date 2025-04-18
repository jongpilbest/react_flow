// actions.js
'use server';


// 

async function modal_struction(text_description,Start_number,rootNode){
  const systemPrompt = `
  당신은 SQL 분석 전문가입니다. 사용자가 제공한 SQL 문장을 초보자가 쉽게 이해할 수 있도록 **트리 형태로 단계별 분해**해야 합니다. 사용자는 다음 문장: ${text_description} 를 트리 형태로 분석해달라고 요청했습니다.
  
  📐 절 단위 분해 기준:
  - SQL은 실행 순서를 고려하여 절 단위로 나눕니다.
  - SELECT ~ FROM ~ → 하나의 SELECT 노드로 묶습니다.
  - WHERE, GROUP BY, HAVING, ORDER BY → 각각 별도 노드로 분리합니다.
  - WHERE 절 내 서브쿼리는 반드시 children 분기로 전개하고, 내부 서브쿼리도 SELECT, FROM, WHERE 등의 절 단위로 나눕니다.
  - JOIN, UNION 등은 하나의 노드로 시작하고, 하위 절은 children으로 분리합니다.
  - COUNT, AVG 등 단일 집계 함수만 있는 서브쿼리는 단일 노드로 처리합니다.
  
  🌳 목적:
  - SQL 쿼리를 **실행 순서대로 절 단위로 분해**하여 각 노드를 children 필드를 통해 트리 구조로 연결합니다.
  - 서브쿼리를 포함하는 노드는 반드시 **children을 2개 포함**해야 합니다:
    1. 서브쿼리 흐름의 시작 노드 (예: Step 2-1)
    2. 서브쿼리 결과를 기다리는 메인 흐름 노드 (예: Step 3)
  - 이렇게 하면 트리가 명확하게 분기되고, 서브쿼리 흐름과 메인 흐름이 구분됩니다.
  
  📘 구성 규칙:
  - 각 노드는 다음 필드를 포함해야 합니다:
    - id: "3", "4" 등 문자열 ID
    - name: "Step 2-1" 등 단계 이름
    - type: "Child"
    - children: 다음 노드 ID 배열
    - data: [SQL 조각, 설명, "+ 어떤 절이 추가되었는지"]
  
  📌 서브쿼리 처리 필수 규칙:
  - 서브쿼리를 포함하는 노드의 설명에는 반드시 다음 문구가 포함되어야 합니다:
    "+ 서브쿼리 필요 → 아래 단계에서 전개됩니다"
  - 서브쿼리 결과를 반영하는 노드에는 다음 문구가 포함되어야 합니다:
    "+ 서브쿼리 결과가 메인 쿼리에 반영됨"
  - 단일 집계 함수로만 구성된 서브쿼리는 단일 노드로 처리하고 분리하지 않습니다.
  
  📏 작성 규칙:
  - 첫 노드의 id는 반드시 ${Start_number}로 시작하며, 이후는 1씩 증가시킵니다.
  - 전체 SQL 문은 반드시 **마지막 노드에서만 출력**되어야 하며, 중간 단계에서는 전체 SQL 또는 중간 결과를 출력하지 않습니다.
  - 중복되거나 불필요한 노드는 생성하지 마세요.
  
  🧠 서브쿼리 흐름 예시:
  Step 1: 메인 SELECT ~ FROM ~  
    ↓  
  Step 2: WHERE 절 도입  
    - children: ["3", "6"]
    - 3: 서브쿼리 시작 (Step 2-1), 6: 메인 흐름 복귀 (Step 3)  
    ↓  
  Step 2-1 → Step 2-2 → Step 2-3 (서브쿼리 전개 및 완료)  
    ↓  
  Step 3: 메인 WHERE 절에 서브쿼리 결과 삽입  
    ↓  
  Step 4: 최종 sql 문 완성 결과
  
  📤 출력 규칙:
  - 출력은 설명 없이 **JSON 객체**만 반환합니다 (코드 블록 사용 금지).
  - 각 data 필드는 [SQL 조각, 설명, "+ 어떤 절이 추가되었는지"] 형식으로 작성하세요.
  
  📦 예시:
  {
    "2": {
      "id": "2",
      "name": "Step 1",
      "type": "Child",
      "children": ["3"],
      "data": [
        "SELECT * FROM DOCTOR",
        "DOCTOR 테이블에서 모든 열을 선택합니다.",
        "+ WHERE 절 도입"
      ]
    },
    "3": {
      "id": "3",
      "name": "Step 2",
      "type": "Child",
      "children": ["4", "6"],
      "data": [
        "WHERE HIRE_YMD < (서브쿼리)",
        "HIRE_YMD가 서브쿼리의 결과보다 작은 의사 목록을 필터링하기 위한 조건을 추가합니다.",
        "+ 서브쿼리 필요 → 아래 단계에서 전개됩니다"
      ]
    },
    "4": {
      "id": "4",
      "name": "Step 2-1",
      "type": "Child",
      "children": ["5"],
      "data": [
        "SELECT AVG(HIRE_YMD) FROM DOCTOR",
        "DOCTOR 테이블에서 고용일자(HIRE_YMD)의 평균을 계산합니다.",
        "+ 서브쿼리 완성"
      ]
    },
    "5": {
      "id": "5",
      "name": "Step 3",
      "type": "Child",
      "children": ["6"],
      "data": [
        "WHERE HIRE_YMD < (SELECT AVG(HIRE_YMD) FROM DOCTOR)",
        "메인 쿼리에서 고용일자(HIRE_YMD)가 서브쿼리에서 계산한 평균보다 작은 의사들만 필터링합니다.",
        "+ 서브쿼리 결과가 메인 쿼리에 반영됨"
      ]
    },
    "6": {
      "id": "6",
      "name": "Step 4",
      "type": "Child",
      "children": [],
      "data": [
        "SELECT * FROM DOCTOR WHERE HIRE_YMD < (SELECT AVG(HIRE_YMD) FROM DOCTOR)",
        "최종 SQL 쿼리를 완성합니다. 고용일자가 전체 평균보다 빠른 의사들의 모든 정보를 조회합니다.",
        "+ 전체 SQL 문 최종 조합 완료"
      ]
    }
  }
    📦 예시2 :
{
  "1": {
    "id": "1",
    "name": "Step 1",
    "type": "Child",
    "children": ["2"],
    "data": [
      "SELECT A.name, B.salary FROM EMPLOYEE A",
      "EMPLOYEE 테이블에서 직원 이름을, SALARY 테이블에서 급여를 가져옵니다.",
      "+ SELECT 절 도입"
    ]
  },
  "2": {
    "id": "2",
    "name": "Step 2",
    "type": "Child",
    "children": ["3", "4"],
    "data": [
      "LEFT JOIN SALARY B ON A.id = B.emp_id",
      "EMPLOYEE 테이블을 SALARY 테이블과 LEFT JOIN으로 결합합니다.",
      "+ JOIN 절 도입 → 아래 ON 절 및 메인 흐름 분기됩니다"
    ]
  },
  "3": {
    "id": "3",
    "name": "Step 2-1",
    "type": "Child",
    "children": ["5"],
    "data": [
      "ON A.id = B.emp_id",
      "JOIN 조건을 분리하여 처리합니다.",
      "+ JOIN 조건이 메인 흐름에 전개됩니다"
    ]
  },
  "4": {
    "id": "4",
    "name": "Step 3",
    "type": "Child",
    "children": ["5"],
    "data": [
      "JOIN 결과가 메인 흐름에 반영됨",
      "JOIN을 적용한 결과를 메인 쿼리에 통합합니다.",
      "+ JOIN 결과가 메인 흐름에 반영됨"
    ]
  },
  "5": {
    "id": "5",
    "name": "Step 4",
    "type": "Child",
    "children": [],
    "data": [
      "SELECT A.name, B.salary FROM EMPLOYEE A LEFT JOIN SALARY B ON A.id = B.emp_id",
      "최종 SQL 쿼리를 완성합니다.",
      "+ 전체 SQL 문 최종 조합 완료"
    ]
  }
}


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
        { role: "system", content: "당신은 SQL 전문가입니다. 자연어 요청에 대해 정확한 SQL을 생성하세요. 데이터는 다음은 종합병원에 속한 의사 정보를 담은 DOCTOR 테이블입니다. DOCTOR 테이블은 다음과 같으며 DR_NAME, DR_ID, LCNS_NO, HIRE_YMD, MCDP_CD, TLNO는 각각 의사이름, 의사ID, 면허번호, 고용일자, 진료과코드, 전화번호를 나타냅니다. 설명은 제외하고 sql 만 만들어주세요 "  },
        { role: "user", content: text_description }
      ],
      temperature: 0.3,
    }),
  });
  
  const dataResponse = await response.json();

  const sqlQuery = dataResponse.choices[0].message.content
  console.log(sqlQuery,'결과 뭐')
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
        { role: "user", content: sqlQuery }
      ],
      temperature: 0.5,
    }),
  });
  const dataResponse2 = await response2.json();

  const sqlQuery2 = dataResponse2.choices[0].message.content


  return sqlQuery2




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