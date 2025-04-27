// actions.js
'use server';


// 

async function modal_struction(text_description,Start_number,rootNode){
  const systemPrompt = `
  당신은 SQL 분석 전문가입니다. 사용자가 제공한 SQL 문장을 초보자가 쉽게 이해할 수 있도록 **트리 형태로 단계별 분해**해야 합니다. 사용자는 다음 문장: ${text_description} 를 트리 형태로 분석해달라고 요청했습니다.
  인 흐름에 전개됩니다"
   
Step 1 (원래 테이블):

FROM doctors 테이블에서 모든 데이터를 가져옵니다. data[3]에 실제 데이터 예시를 추가하여 전체 doctor 테이블 데이터를 보여줍니다.

Step 2 (서브쿼리 시작):

WHERE SPECIALTY IN (서브쿼리)로 서브쿼리 결과를 메인 쿼리에서 사용하여 필터링합니다. 여기서 department 대신 SPECIALTY 컬럼을 사용합니다.

Step 3 (원래 테이블):

FROM doctors에서 원래 테이블의 데이터를 가져오고, 이 단계에서는 GROUP BY 절을 추가하여 SPECIALTY별로 의사를 그룹화합니다.

Step 4 (GROUP BY):

SPECIALTY별로 의사를 그룹화하고, 의사 수가 2명 이상인 SPECIALTY만 추출하는 HAVING 조건을 추가합니다.

Step 5 (HAVING):

HAVING COUNT(*) >= 2로 의사 수가 2명 이상인 SPECIALTY만 선택합니다.

Step 6 (서브쿼리 최종 SELECT 문):

SELECT SPECIALTY FROM doctors GROUP BY SPECIALTY HAVING COUNT(*) >= 2로 최종적으로 SPECIALTY가 2명 이상인 값만 선택됩니다.

Step 7 (최종 SELECT 문):

SELECT DR_NAME, SPECIALTY FROM doctors WHERE SPECIALTY IN (서브쿼리)로 최종적으로 의사 이름과 진료과를 반환하고, SPECIALTY별로 정렬된 결과를 출력합니다.


규칙
- 서브쿼리를 포함하는 노드는 반드시 **children을 2개 포함**해야 합니다:
    1. 서브쿼리 흐름의 시작 노드 (예: Step 2-1)
    2. 서브쿼리 결과를 기다리는 메인 흐름 노드 (예: Step 3)
  - 이렇게 하면 트리가 명확하게 분기되고, 서브쿼리 흐름과 메인 흐름이 구분됩니다

   - 서브쿼리란:
   - SELECT 문 안에 포함된 또 다른 SELECT 문을 의미합니다.
   - 예: WHERE dept_id IN (SELECT dept_id FROM departments WHERE ...) → 괄호 안의 SELECT가 서브쿼리입니다.
   - 다음과 같은 위치에서 자주 등장합니다:
     - WHERE 절
     - FROM 절 (인라인 뷰)
     - SELECT 절 (스칼라 서브쿼리)
    - 이와 같은 중첩된 SELECT 문을 반드시 찾아내어, 내부 서브쿼리도 꼭  📌 - WHERE, GROUP BY, HAVING, ORDER BY  📌  등의 절 단위로 나눕니다.
    - 서브쿼리의 최종결과는 꼭 출력해주세요
    
   📏 작성 규칙:
  - 첫 노드의 id는 반드시 ${Start_number}로 시작하며, 이후는 1씩 증가시킵니다.
  - 전체 SQL 문은 반드시 **마지막 노드에서만 출력**되어야 하며, 중간 단계에서는 전체 SQL 또는 중간 결과를 출력하지 않습니다.
  - 중복되거나 불필요한 노드는 생성하지 마세요.

  📘 구성 규칙:
  - 각 노드는 다음 필드를 포함해야 합니다:
    - id: "3", "4" 등 문자열 ID
    - name: "Step 2-1" 등 단계 이름
    - type: "Child"
    - children: 다음 노드 ID 배열
    - data: [SQL 조각, 설명, " 부모에서 추가된 + sql 문법 ]
     📘 예시 구성 규칙 :
     📌 -  꼭지켜주세요!!!!!! 📌
  data[0] 가       "FROM DOCTOR",
 일때나 data[1] 서브쿼리에서 DOCTOR 테이블을 가져옵니다일때는  data[3] 은
   ["DR_NAME", "DR_ID", "LCNS_NO", "TLNO", "SPECIALTY", "PHONE"] 유지해야됩니다!!!
  [ 
  [
  ["DR_NAME", "DR_ID", "LCNS_NO", "TLNO", "SPECIALTY", "PHONE"],
  [
    ["루피", "DR20090029", "LC00010001", "2009-03-01", "CS", "01085482011"],
    ["패티", "DR20090001", "LC00010901", "2009-07-01", "CS", "01085220122"],
    ["뽀로로", "DR20170123", "LC00091201", "2017-03-01", "GS", "01034969210"],
    ["티거", "DR20100011", "LC00011201", "2010-03-01", "NP", "01034229818"],
    ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278"],
    ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190"]

    /// 추가가능 하게 만들어서 부모 > 자식 관의 관계를 더 잘 보여줘도 됩니다. 
            
  ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278", "2014-03-01"],
  ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190", "2012-12-01"]
  
]
]
]

          
     - 각 노드의 data[3]에는 해당 단계에서  *그에 따른 결과의 변화**를 명확하게 포함합니다.
       
     - 예를 들어, WHERE 절을 추가하는 단계에서는 이전 결과에서 어떤 데이터가 필터링되는지 명시적으로 보여줘야 합니다.
     📌- !!!(꼭 지켜주세요) 각 절의 data[3]에는 "부모결과" → "자식 결과"의 흐름으로 최종 결과 변화가 보이게 적당한 예시를 제공해주세요  📌
       - doctors 테이블은 컬럼 구조는 유지하지만, 데이터 행을 추가할 수 있다는 점을 명시합니다. 
         [ 
         [
  ["DR_NAME", "DR_ID", "LCNS_NO", "TLNO", "SPECIALTY", "PHONE"],
  [
    ["루피", "DR20090029", "LC00010001", "2009-03-01", "CS", "01085482011"],
    ["패티", "DR20090001", "LC00010901", "2009-07-01", "CS", "01085220122"],
    ["뽀로로", "DR20170123", "LC00091201", "2017-03-01", "GS", "01034969210"],
    ["티거", "DR20100011", "LC00011201", "2010-03-01", "NP", "01034229818"],
    ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278"],
    ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190"]

    /// 추가가능 하게 만들어서 부모 > 자식 관의 관계를 더 잘 보여줘도 됩니다. 
            
  ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278", "2014-03-01"],
  ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190", "2012-12-01"]
  
]
]
  
         
    


   
      

실험 예시 

{
  "2": {
    "id": "2",
    "name": "Step 1: 원래 테이블",
    "type": "Child",
    "children": ["3"],
    "data": [
      "FROM doctors",
      "doctors 테이블에서 데이터를 가져옵니다.",
      "+ WHERE",
        //     - FROM doctors 절에서 전체 데이터를 가져온다는 의미는 테이블의 모든 컬럼 5개를 보여줘야 한다는 뜻입니다.
      [
      [ 
    ["DR_NAME", "DR_ID", "LCNS_NO", "TLNO", "SPECIALTY", "PHONE"],
    [
      ["루피", "DR20090029", "LC00010001", "2009-03-01", "CS", "01085482011"],
      ["패티", "DR20090001", "LC00010901", "2009-07-01", "CS", "01085220122"],
      ["뽀로로", "DR20170123", "LC00091201", "2017-03-01", "GS", "01034969210"],
      ["티거", "DR20100011", "LC00011201", "2010-03-01", "NP", "01034229818"],
      ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278"],
      ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190"]
    ]
  ]
]
     



    
  },
  "3": {
    "id": "3",
    "name": "Step 2: 서브쿼리 시작",
    "type": "Child",
    "children": ["4", "8"],
    "data": [
      "WHERE SPECIALTY IN (서브쿼리)",
      "SPECIALTY가 서브쿼리 결과에 포함된 진료과만 필터링합니다.",
      "+ 서브쿼리 필요 → 아래 단계에서 전개됩니다"
    ]
  },
  "4": {
    "id": "4",
    "name": "Step 3: 원래 테이블 (FROM doctors)",
    "type": "Child",
    "children": ["6"],
    "data": [
      "FROM doctors",
      "doctors 테이블에서 데이터를 가져옵니다.",
      "+ GROUP BY 추가",
      //     - FROM doctors 절에서 전체 데이터를 가져온다는 의미는 테이블의 모든 컬럼 5개를 보여줘야 한다는 뜻입니다.  
      [
      [ 
    ["DR_NAME", "DR_ID", "LCNS_NO", "TLNO", "SPECIALTY", "PHONE"],
    [
      ["루피", "DR20090029", "LC00010001", "2009-03-01", "CS", "01085482011"],
      ["패티", "DR20090001", "LC00010901", "2009-07-01", "CS", "01085220122"],
      ["뽀로로", "DR20170123", "LC00091201", "2017-03-01", "GS", "01034969210"],
      ["티거", "DR20100011", "LC00011201", "2010-03-01", "NP", "01034229818"],
      ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278"],
      ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190"]
    ]
  ]
    ]
  },
  "5": {
    "id": "5",
    "name": "Step 4: GROUP BY SPECIALTY",
    "type": "Child",
    "children": ["6"],
    "data": [
      "GROUP BY SPECIALTY",
      "SPECIALTY별로 의사들을 그룹화합니다.",
      "+ HAVING 추가",
      [
        [
          ["SPECIALTY", "COUNT(*)"],
          [
            ["CS", 2],
            ["GS", 1],
            ["NP", 1],
            ["OS", 1],
            ["FM", 1]
          ]
        ]
      ]
    ]
  },
  "6": {
    "id": "6",
    "name": "Step 5: HAVING COUNT(*) >= 2",
    "type": "Child",
    "children": ["7"],
    "data": [
      "HAVING COUNT(*) >= 2",
      "의사 수가 2명 이상인 SPECIALTY만 추출합니다.",
      "+ SELECT 추가",
      [
        [
          ["SPECIALTY", "COUNT(*)"],
          [
            ["CS", 2]
          ]
        ]
      ]
    ]
  },
  "7": {
    "id": "7",
    "name": "Step 6: 서브쿼리 최종 SELECT 문",
    "type": "Child",
    "children": ["8"],
    "data": [
      "SELECT SPECIALTY FROM doctors GROUP BY SPECIALTY HAVING COUNT(*) >= 2",
      "서브쿼리에서 SPECIALTY 컬럼만 선택하고, 의사 수가 2명 이상인 SPECIALTY를 반환합니다.",
      "+ 서브쿼리 결과 반영",
      [
        [
          ["CS"],
          [
            ["CS"]
          ]
        ]
      ]
    ]
  },
  "8": {
    "id": "8",
    "name": "Step 7: 최종 SELECT 문으로 의사 정보 추출",
    "type": "Child",
    "children": [],
    "data": [
      "SELECT DR_NAME, SPECIALTY FROM doctors WHERE SPECIALTY IN (서브쿼리) ORDER BY SPECIALTY",
      "의사 이름(DR_NAME)과 진료과(SPECIALTY)를 반환하며, SPECIALTY별로 정렬된 결과를 출력합니다.",
      "",
      [
        [
          ["DR_NAME", "SPECIALTY"],
          [
            ["루피", "CS"],
            ["패티", "CS"]
          ]
        ]
      ]
    ]
  }
}


예시2
{
  "2": {
    "id": "2",
    "name": "Step 1: 원래 테이블",
    "type": "Child",
    "children": ["3"],
    "data": [
      "FROM DOCTOR",
      "DOCTOR 테이블에서 데이터를 가져옵니다.",
      "+ WHERE",
      [
        [
          ["DR_NAME", "DR_ID", "LCNS_NO", "HIRE_YMD", "MCDP_CD", "TLNO"],
          [
            ["루피", "DR20090029", "LC00010001", "2009-03-01", "CS", "01085482011"],
            ["패티", "DR20090001", "LC00010901", "2009-07-01", "CS", "01085220122"],
            ["뽀로로", "DR20170123", "LC00091201", "2017-03-01", "GS", "01034969210"],
            ["티거", "DR20100011", "LC00011201", "2010-03-01", "NP", "01034229818"],
            ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278"],
            ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190"]
          ]
        ]
      ]
    ]
  },
  "3": {
    "id": "3",
    "name": "Step 2: 서브쿼리 시작",
    "type": "Child",
    "children": ["4", "6"],
    "data": [
      "WHERE HIRE_YMD = (서브쿼리)",
      "HIRE_YMD가 서브쿼리 결과와 동일한 의사만 필터링합니다.",
      "+ 서브쿼리 필요 → 아래 단계에서 전개됩니다"
    ]
  },
  "4": {
    "id": "4",
    "name": "Step 3: 서브쿼리 FROM 절",
    "type": "Child",
    "children": ["5"],
    "data": [
      "FROM DOCTOR",
      "서브쿼리에서 DOCTOR 테이블을 가져옵니다.",
      "+ MIN 함수 사용",
      [
        [
          ["DR_NAME", "DR_ID", "LCNS_NO", "HIRE_YMD", "MCDP_CD", "TLNO"],
          [
            ["루피", "DR20090029", "LC00010001", "2009-03-01", "CS", "01085482011"],
            ["패티", "DR20090001", "LC00010901", "2009-07-01", "CS", "01085220122"],
            ["뽀로로", "DR20170123", "LC00091201", "2017-03-01", "GS", "01034969210"],
            ["티거", "DR20100011", "LC00011201", "2010-03-01", "NP", "01034229818"],
            ["품바", "DR20090231", "LC00011302", "2015-11-01", "OS", "01049840278"],
            ["티몬", "DR20090112", "LC00011162", "2010-03-01", "FM", "01094622190"]
          ]
        ]
      ]
    ]
  },
  "5": {
    "id": "5",
    "name": "Step 4: 서브쿼리 MIN 함수",
    "type": "Child",
    "children": ["6"],
    "data": [
      "SELECT MIN(HIRE_YMD) FROM DOCTOR",
      "가장 오래된 HIRE_YMD를 선택합니다.",
      "+ 서브쿼리 결과 반영",
      [
        [
          ["MIN(HIRE_YMD)"],
          [
            ["2009-03-01"]
          ]
        ]
      ]
    ]
  },
  "6": {
    "id": "6",
    "name": "Step 5: 최종 SELECT 문으로 의사 정보 추출",
    "type": "Child",
    "children": [],
    "data": [
      "SELECT DR_NAME, DR_ID, LCNS_NO, HIRE_YMD, MCDP_CD, TLNO FROM DOCTOR WHERE HIRE_YMD = (SELECT MIN(HIRE_YMD) FROM DOCTOR)",
      "가장 오래 근무한 의사와 동일한 고용일자를 가진 모든 의사의 정보를 반환합니다.",
      "",
      [
        [
          ["DR_NAME", "DR_ID", "LCNS_NO", "HIRE_YMD", "MCDP_CD", "TLNO"],
          [
            ["루피", "DR20090029", "LC00010001", "2009-03-01", "CS", "01085482011"]
          ]
        ]
      ]
    ]
  }
}


  📤 출력 규칙:
  - 출력은 설명 없이 **JSON 객체**만 반환합니다 (코드 블록 사용 금지).
  - 각 data 필드는 [SQL 조각, 설명, "+ 어떤 절이 추가되었는지"] 형식으로 작성하세요.
   


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
        { role: "system", content: "당신은 SQL 전문가입니다. 자연어 요청에 대해 정확한 nySQL을 생성하세요. 데이터는 다음은 종합병원에 속한 의사 정보를 담은 DOCTOR 테이블입니다. DOCTOR 테이블은 다음과 같으며 DR_NAME, DR_ID, LCNS_NO, HIRE_YMD, MCDP_CD, TLNO는 각각 의사이름, 의사ID, 면허번호, 고용일자, 진료과코드, 전화번호를 나타냅니다. 설명은 제외하고 sql 만 만들어주세요 "  },
        { role: "user", content: text_description }
      ],
      temperature: 0.1,
    }),
  });
  
  const dataResponse = await response.json();

  const sqlQuery = dataResponse.choices[0].message.content

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
      temperature: 0,
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