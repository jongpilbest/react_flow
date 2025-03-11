

export async function fetchSQLSolution (user,user2,userText) {
    try {
      // [json데이터 , user가 작성한 text] 을 params 으로 받습니다. 
      // 사용자 입력이 있으면 추가하는 조건문
      const userTextPrompt = userText ? `\n사용자가 추가 입력한 설명:\n${userText}\n` : '';
      const exampleJson=`SQL 문제를 해결하는 JSON 형식의 단계별 절차를 생성해줘.

      ### **요구사항**
      1. 가장 많은 리뷰를 작성한 회원을 찾아 해당 회원의 리뷰를 조회하는 SQL 쿼리를 작성해줘.
      2. 출력 컬럼: MEMBER_NAME, REVIEW_TEXT, REVIEW_DATE
      3. 정렬 조건:
         - REVIEW_DATE 오름차순
         - 동일한 날짜는 REVIEW_TEXT 오름차순 정렬
      
      ### **출력 형식**
      JSON 구조로 제공해줘.
      
        - step: "테이블명_STEP_번호" 형식 (예: "MEMBER_PROFILE_1", "JOIN_STEP_1")
        - parent_node:
          - 단일 테이블 사용 시 이전 단계 "step"
          - JOIN 수행 시 두 테이블 중 더 많은 자식 노드를 가진 테이블을 부모로 설정
          - 이후 단계는 이전 JOIN_STEP_x을 부모로 설정
        - expected_result: 예상되는 결과 배열
      
      예제:
      {
        "steps": [
          { "step": "MEMBER_PROFILE_1", "description": "회원 ID와 이름 조회", "sql": "...", "expected_result": [...], "parent_node": "MEMBER_PROFILE_0" },
          { "step": "REST_REVIEW_1", "description": "회원 ID별 리뷰 조회", "sql": "...", "expected_result": [...], "parent_node": "REST_REVIEW_0" },
          { "step": "REST_REVIEW_2", "description": "회원별 리뷰 개수 계산", "sql": "...", "expected_result": [...], "parent_node": "REST_REVIEW_1" },
          { "step": "REST_REVIEW_3", "description": "가장 많은 리뷰 회원 찾기", "sql": "...", "expected_result": [...], "parent_node": "REST_REVIEW_2" },
          { "step": "MEMBER_PROFILE_2", "description": "해당 회원의 이름 조회", "sql": "...", "expected_result": [...], "parent_node": "MEMBER_PROFILE_1" },
          { "step": "JOIN_STEP_1", "description": "회원과 리뷰 데이터 JOIN", "sql": "...", "expected_result": [...], "parent_node": "REST_REVIEW_3" },
          { "step": "JOIN_STEP_2", "description": "리뷰 정렬 후 최종 조회", "sql": "...", "expected_result": [...], "parent_node": "JOIN_STEP_1" }
        ],
        "final_sql": "...",
        "explanation": "..."
      }`
      const prompt = `
      ${userTextPrompt} 을 해결하고 싶은데 
      제공된 데이터로 
      SQL 문제를 해결하는 과정을 JSON 형식으로 단계별로 설명해줘. 
      
      이때 예상되는 결과는 배열로 제공해줘.
      
      ### **데이터**:
      ${JSON.stringify(user)}
      
      ### **출력 형식**
      아래 **JSON 구조**로 SQL 실행 과정을 단계별로 표현해줘.
      
      1. \`"step"\` 필드는 \`"테이블명_STEP_번호"\` 형식으로 작성해줘.
      2. 한 개의 테이블만 활용하는 경우 바로 전 단계의 \`"step"\`을 \`"parent_node"\`로 설정해줘.
      3. \`JOIN\`이 필요한 경우 **두 테이블 중 더 많은 자식을 가진 테이블을 \`parent_node\`로 설정**하고, 이후 단계는 이전 \`JOIN_STEP_x\`을 부모로 설정해줘.
      4. \`"expected_result"\`는 예상되는 결과를 배열 형식으로 제공해줘.
      
      ### **예제**
      ${exampleJson}  // 위 JSON 예제를 변수로 삽입
      `;

        {/*  여기 api 호출하는 부분 .  */}
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "system", content: "당신은 SQL 전문가입니다." }, { role: "user", content: prompt }],
          temperature: 0.5,
        }),
      });
  // 
      const dataResponse = await response.json();
    
      //const dataResponse = [
      //  {
      //      "step": 1,
      //      "description": "먼저 전체 데이터를 조회합니다.",
      //      "sql": "SELECT * FROM animal_shelter;",
      //      "expected_result": [
      //          [
      //              "ANIMAL_ID",
      //              "ANIMAL_TYPE",
      //              "DATETIME",
      //              "INTAKE_CONDITION",
      //              "NAME",
      //              "SEX_UPON_INTAKE"
      //          ],
      //          [
      //              "A562649",
      //              "Dog",
      //              "2014-03-20 18:06",
      //              "Sick",
      //              "NULL",
      //              "Spayed Female"
      //          ],
      //          [
      //              "A412626",
      //              "Dog",
      //              "2016-03-13 11:17",
      //              "Normal",
      //              "*Sam",
      //              "Neutered Male"
      //          ],
      //          [
      //              "A563492",
      //              "Dog",
      //              "2014-10-24 14:45",
      //              "Normal",
      //              "*Sam",
      //              "Neutered Male"
      //          ],
      //          [
      //              "A513956",
      //              "Dog",
      //              "2017-06-14 11:54",
      //              "Normal",
      //              "*Sweetie",
      //              "Spayed Female"
      //          ]
      //      ]
      //  },
      //  {
      //      "step": 2,
      //      "description": "INTAKE_CONDITION 이 'Normal'인 데이터만 조회합니다.",
      //      "sql": "SELECT * FROM animal_shelter WHERE INTAKE_CONDITION = 'Normal';",
      //      "expected_result": [
      //          [
      //              "ANIMAL_ID",
      //              "ANIMAL_TYPE",
      //              "DATETIME",
      //              "INTAKE_CONDITION",
      //              "NAME",
      //              "SEX_UPON_INTAKE"
      //          ],
      //          [
      //              "A412626",
      //              "Dog",
      //              "2016-03-13 11:17",
      //              "Normal",
      //              "*Sam",
      //              "Neutered Male"
      //          ],
      //          [
      //              "A563492",
      //              "Dog",
      //              "2014-10-24 14:45",
      //              "Normal",
      //              "*Sam",
      //              "Neutered Male"
      //          ],
      //          [
      //              "A513956",
      //              "Dog",
      //              "2017-06-14 11:54",
      //              "Normal",
      //              "*Sweetie",
      //              "Spayed Female"
      //          ]
      //      ]
      //  },
      //  {
      //      "step": 3,
      //      "description": "이름이 '*Sam'인 데이터만 조회합니다.",
      //      "sql": "SELECT * FROM animal_shelter WHERE INTAKE_CONDITION = 'Normal' AND NAME = '*Sam';",
      //      "expected_result": [
      //          [
      //              "ANIMAL_ID",
      //              "ANIMAL_TYPE",
      //              "DATETIME",
      //              "INTAKE_CONDITION",
      //              "NAME",
      //              "SEX_UPON_INTAKE"
      //          ],
      //          [
      //              "A412626",
      //              "Dog",
      //              "2016-03-13 11:17",
      //              "Normal",
      //              "*Sam",
      //              "Neutered Male"
      //          ],
      //          [
      //              "A563492",
      //              "Dog",
      //              "2014-10-24 14:45",
      //              "Normal",
      //              "*Sam",
      //              "Neutered Male"
      //          ]
      //      ]
      //  }
   // ]//
   
     return  dataResponse
      //return JSON.parse(dataResponse.choices[0].message.content)
    } catch (error) {
      console.log(error.message,'에러메세지 ')
      return '서버에서 에러가 발생했습니다.';
    }
  }
  
