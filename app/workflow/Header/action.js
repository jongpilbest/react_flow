// actions.js
'use server';


// 

async function modal_struction(text_description){
  const systemPrompt = `
당신은 SQL 분석 및 시각화 전문가입니다.

아래에 제공하는 SQL 문장을 **절(clause) 단위로 세밀하게 분리**하고,  
**절 간의 흐름(의존 관계)** 을 분석하여 **React Flow**에서 사용할 수 있는 **노드(node)** 와 **엣지(edge)** 리스트를 JSON 형태로 출력하세요.

---

## 📌 출력 규칙

1. 각 노드는 다음 정보를 포함해야 합니다:
    - id: 고유 번호 (문자열, "1", "2", "3", ...)
    - data: {
    name: 절 이름 (예: "From", "Join", "Filter", "Group By", "Having", "Select", "서브쿼리") 간단하게! 
    des: 절 설명
    sql: ${text_description}에서 해당 절에 대응하는 SQL 문을 줄바꿈(\n)이 있으면 다시 문자열이 나오기까지지 들여쓰기( 공백 )까지 반영하여 작성해주세요.!! 예시를 보고 꼭 지켜주세요

    }
    - position: { "x": 정수, "y": 정수 }
    - type:'NewNL'

2. 각 엣지는 다음 정보를 포함해야 합니다:
    - source: 출발 노드 id
    - target: 도착 노드 id

3. **x, y 좌표 배치 규칙**
    - 메인 쿼리는 x=0을 기준으로 수직(y축) 방향으로 배치합니다. (y는 150씩 증가)
    - JOIN은 양쪽 테이블을 x=0, x=250 등의 다른 위치에 배치하고, 중앙(x=125)에서 합칩니다.
    - 서브쿼리가 등장하면 메인 흐름에서 오른쪽(x=300, x=600 등)으로 가지(branch)를 뻗어 별도로 전개합니다.
    - 서브쿼리 결과는 "서브쿼리 결과" 노드로 요약하고, 메인 흐름과 병합합니다.
    - 병합 이후 다시 중앙 x=0 근처로 돌아와 메인 흐름을 계속 진행합니다.

4. **서브쿼리 처리 방식**
    - 서브쿼리 내부 세부 절차는 풀지 않고, 하나의 요약된 "서브쿼리 결과" 노드로 표현합니다.
    - 서브쿼리 결과 노드에서는 어떤 값을 반환하는지만 간단히 설명합니다 (예: "AVG(total_amount) 반환").

---

## 📌 절 분리 세부 규칙

- FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, SELECT는 각각 반드시 분리된 노드로 만듭니다.
- SELECT는 최종 노드로 생성합니다.
- JOIN은 어떤 테이블을 어떤 조건으로 연결하는지 data에 반드시 명시합니다.
- 서브쿼리는 "서브쿼리 결과" 노드로 요약하고, 메인 흐름에 연결합니다.
5. 복합 조건 처리 (AND / OR)
    - WHERE 절 안에 복수 조건(AND, OR)이 존재할 경우, 각각을 별도 노드로 분리합니다.
    - AND/OR 조건 각각을 별도 노드로 만들고, 메인 WHERE 절에서 children 분기 형태로 연결합니다.

6. JOIN 표현 방식
    - JOIN은 양쪽 테이블을 독립된 FROM 노드로 구성한 후, 중앙 JOIN 노드로 병합합니다.
    - JOIN 노드는 항상 두 개 이상의 테이블을 source로 받아야 하며, 시각적으로 합쳐지는 구조를 만들어야 합니다.

7. 서브쿼리 세부 트리 전개 (선택적)
    - 서브쿼리 안에 다시 서브쿼리가 존재하는 경우, 서브쿼리 내부도 트리 구조로 전개합니다.
    - 이때 서브쿼리 depth가 깊어질수록 x축을 300px씩 추가 이동시켜 표현합니다.

 8. 서브쿼리 분기
    - WHERE, HAVING 등에서 서브쿼리가 등장하면,
      메인 WHERE 노드에서 오른쪽(x+300)으로 "서브쿼리 결과" 노드를 별도 생성하여 연결하세요.
    - 메인 WHERE 절은 계속 아래(y+150)로 내려가고,
      서브쿼리는 오른쪽 가지(branch)로 확장됩니다.
    - 서브쿼리 안에 서브쿼리가 또 등장하면, 그 서브쿼리도 오른쪽(x+300)으로 추가로 분기합니다.
   9. 주의사항
    - SQL 문장을 읽을 때, WHERE, HAVING 안에 **(SELECT 로 시작하는 부분**이 있으면 반드시 "서브쿼리 결과" 노드로 별도 생성해야 합니다.
    - 서브쿼리는 절대 WHERE, HAVING 안에 그냥 포함시키지 말고, 오른쪽 브랜치로 분기하여 별도 트리로 표현하세요.
    - 모든 서브쿼리는 반드시 새로운 노드로, x축 +300 이동하여 배치해야 합니다.

예시:
- WHERE salary > (SELECT AVG(salary) FROM employees)
    ➔
    1. WHERE salary > (서브쿼리 결과) 노드 만들기
    2. 서브쿼리 자체를 오른쪽 가지로 만들어 "서브쿼리 결과" 노드 추가

---

## 📌 출력 예시 1 
SELECT c.customer_name, o.order_date
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.total_amount >= (
    SELECT AVG(total_amount)
    FROM orders
    WHERE order_date >= '2023-01-01'
)
AND c.customer_id IN (
    SELECT customer_id
    FROM vip_customers
);

{
{
"nodes": [
    {
      "id": "1",
      "data": {
        "name": "From customers",
        "des": "customers 테이블을 참조",
        "sql": "FROM customers c"
      },
      "position": { "x": 0, "y": 0 },
      "type": "NewNL"
    },
    {
      "id": "2",
      "data": {
        "name": "From orders",
        "des": "orders 테이블을 참조",
        "sql": "orders o"
      },
      "position": { "x": 250, "y": 0 },
      "type": "NewNL"
    },
    {
      "id": "3",
      "data": {
        "name": "Inner Join",
        "des": "customer_id 기준으로 조인",
        "sql": "JOIN orders o ON c.customer_id = o.customer_id"
      },
      "position": { "x": 125, "y": 150 },
      "type": "NewNL"
    },
    {
      "id": "4",
      "data": {
        "name": "Filter 시작",
        "des": "WHERE 절 필터링 시작",
        "sql": "WHERE o.total_amount >= (\n    SELECT AVG(total_amount)\n    FROM orders\n    WHERE order_date >= '2023-01-01'\n)\nAND c.customer_id IN (\n    SELECT customer_id\n    FROM vip_customers\n)"
      },
      "position": { "x": 125, "y": 300 },
      "type": "NewNL"
    },
    {
      "id": "5",
      "data": {
        "name": "서브쿼리1",
        "des": "평균 total_amount를 반환",
        "sql": "SELECT AVG(total_amount)\n    FROM orders\n    WHERE order_date >= '2023-01-01'"
      },
      "position": { "x": -100, "y": 450 },
      "type": "NewNL"
    },
    {
      "id": "6",
      "data": {
        "name": "서브쿼리2",
        "des": "vip 고객 리스트 반환",
        "sql": "SELECT customer_id\n    FROM vip_customers"
      },
      "position": { "x": 350, "y": 450 },
      "type": "NewNL"
    },
    {
      "id": "7",
      "data": {
        "name": "WHERE 완료",
        "des": "필터링 완료",
        "sql": "WHERE o.total_amount >= (\n    SELECT AVG(total_amount)\n    FROM orders\n    WHERE order_date >= '2023-01-01'\n)\nAND c.customer_id IN (\n    SELECT customer_id\n    FROM vip_customers\n);"

      },
      "position": { "x": 125, "y": 600 },
      "type": "NewNL"
    },
    {
      "id": "8",
      "data": {
        "name": "Select",
        "des": "최종 결과 선택",
        "sql": "SELECT c.customer_name, o.order_date"
      },
      "position": { "x": 125, "y": 750 },
      "type": "NewNL"
    }
  ]

}
  "edges": [
    { "source": "1", "target": "3" ,"id":"1"},
    { "source": "2", "target": "3" ,"id":"2"},
    { "source": "3", "target": "4" ,"id":"3"},
    { "source": "4", "target": "5" ,"id":"4"},
    { "source": "4", "target": "6" ,"id":"5"},
    { "source": "5", "target": "7" ,"id":"6"},
    { "source": "6", "target": "7" ,"id":"7"},
    { "source": "7", "target": "8" ,"id":"8"}
  ]
}

## 📌 출력 예시 2

SELECT e.employee_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE department_id IN (
        SELECT department_id
        FROM departments
        WHERE location_id = (
            SELECT location_id
            FROM locations
            WHERE city = 'New York'
        )
    )
)
AND e.hire_date > (
    SELECT MIN(hire_date)
    FROM employees
    WHERE job_id LIKE 'SA%'
);
인경우

{  
  "nodes": [
    {
      "id": "1",
      "data": {
        "name": "From employees",
        "des": "employees 테이블에서 e 별칭",
        "sql": "FROM employees e"
      },
      "position": { "x": 0, "y": 0 },
      "type": "NewNL"
    },
    {
      "id": "2",
      "data": {
        "name": "From departments",
        "des": "departments 테이블에서 d 별칭",
        "sql": "departments d"
      },
      "position": { "x": 250, "y": 0 },
      "type": "NewNL"
    },
    {
      "id": "3",
      "data": {
        "name": "Inner Join",
        "des": "e.department_id = d.department_id 기준으로 조인",
        "sql": "JOIN departments d ON e.department_id = d.department_id"
      },
      "position": { "x": 125, "y": 150 },
      "type": "NewNL"
    },
    {
      "id": "4",
      "data": {
        "name": "Filter 시작",
        "des": "WHERE 절 시작",
        "sql": ""
      },
      "position": { "x": 125, "y": 300 },
      "type": "NewNL"
    },
    {
      "id": "5",
      "data": {
        "name": "서브쿼리 1",
        "des": "AVG(salary) 반환 (location_id 기준)",
        "sql": "SELECT AVG(salary)\n    FROM employees\n    WHERE department_id IN (\n        SELECT department_id\n        FROM departments\n        WHERE location_id = (\n            SELECT location_id\n            FROM locations\n            WHERE city = 'New York'\n        )\n    )"
      },
      "position": { "x": 425, "y": 300 },
      "type": "NewNL"
    },
    {
      "id": "6",
      "data": {
        "name": "서브쿼리 1-1",
        "des": "department_id 목록 반환",
        "sql": "SELECT department_id\n        FROM departments\n        WHERE location_id = (\n            SELECT location_id\n            FROM locations\n            WHERE city = 'New York'\n        )"
      },
      "position": { "x": 625, "y": 300 },
      "type": "NewNL"
    },
    {
      "id": "7",
      "data": {
        "name": "서브쿼리 1-2",
        "des": "location_id 반환 (city='New York')",
        "sql": "            SELECT location_id
            FROM locations
            WHERE city = 'New York"
      },
      "position": { "x": 825, "y": 300 },
      "type": "NewNL"
    },
    {
      "id": "8",
      "data": {
        "name": "Filter",
        "des": "e.hire_date가 최소 hire_date보다 큰 경우",
        "sql": "e.hire_date > (\n    SELECT MIN(hire_date)\n    FROM employees\n    WHERE job_id LIKE 'SA%'\n)"
      },
      "position": { "x": 125, "y": 450 },
      "type": "NewNL"
    },
    {
      "id": "9",
      "data": {
        "name": "서브쿼리 2",
        "des": "MIN(hire_date) 반환 (job_id LIKE 'SA%')",
        "sql": "SELECT MIN(hire_date)\n    FROM employees\n    WHERE job_id LIKE 'SA%'"
      },
      "position": { "x": 425, "y": 450 },
      "type": "NewNL"
    },
    {
      "id": "10",
      "data": {
        "name": "WHERE 완료",
        "des": "모든 필터링 완료",
        "sql": ""WHERE e.salary > (\n    SELECT AVG(salary)\n    FROM employees\n    WHERE department_id IN (\n        SELECT department_id\n        FROM departments\n        WHERE location_id = (\n            SELECT location_id\n            FROM locations\n            WHERE city = 'New York'\n        )\n    )\n)\nAND e.hire_date > (\n    SELECT MIN(hire_date)\n    FROM employees\n    WHERE job_id LIKE 'SA%'\n);"
"
      },
      "position": { "x": 125, "y": 600 },
      "type": "NewNL"
    },
    {
      "id": "11",
      "data": {
        "name": "Select",
        "des": "최종 컬럼 선택",
        "sql": "SELECT e.employee_name, d.department_name"
      },
      "position": { "x": 125, "y": 750 },
      "type": "NewNL"
    }
  ]
,

  "edges": [
    { "source": "1", "target": "3","id":"1" },
    { "source": "2", "target": "3","id":"2" },
    { "source": "3", "target": "4","id":"3" },
    { "source": "4", "target": "5","id":"4" },
    { "source": "5", "target": "6","id":"5" },
    { "source": "6", "target": "7","id":"6" },
    { "source": "7", "target": "4","id":"7" },
    { "source": "4", "target": "8","id":"8" },
    { "source": "8", "target": "9","id":"9" },
    { "source": "9", "target": "10", "id":"10" },
    { "source": "10", "target": "11", "id":"11" }
  ]
}

---

📢 반드시 위 포맷에 맞춰 출력하고, 코드블록(\`\`\`)없이  JSON으로 반환해주세요.
  `;
//  
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
//  const dataResponse = await response.json();
//
  //const sqlQuery = dataResponse.choices[0].message.content



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
  // 여기에서 전체 반환이 아니라 nodes만 반
  return parsedData
//  return []

}
  

export async function Flow_chat(formData) {
  const productId = formData.get("text");
  
  
 // console.log("서버에서 받은 productId:", productId);
 // // 여기에 DB 저장, 로직 처리 등 가능
 // console.log("서버에서 받은 productId:", numbers);

  
  const response= await modal_struction(productId)

   return response

}