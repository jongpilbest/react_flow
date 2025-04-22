// LangGraph-compatible Text-to-SQL Chatbot (updated using LangGraph v0.2 and TogetherAI-compatible flow)
import { z } from "zod";
import { AIMessage } from "@langchain/core/messages"
import { Annotation, MessagesAnnotation ,StateGraph, InMemoryStore ,MemorySaver ,LangGraphRunnableConfig } from "@langchain/langgraph";



const inMemoryStore = new InMemoryStore();
import { ChatOpenAI } from "@langchain/openai";
const model = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-4o",
})


const updateMemory = async (
  state: typeof MessagesAnnotation.State,
  config: LangGraphRunnableConfig
) => {
  // Get the store instance from the config
  const store = config.store;

  // Get the user id from the config
  const userId = config.configurable?.user_id;

  // Namespace the memory
  const namespace = [userId, "memories"];

  // ... Analyze conversation and create a new memory

  // Create a new memory ID
  const memoryId = '1';
  
  // We create a new memory
  await store?.put(namespace, memoryId, {
    message: '다음은 종합병원에 속한 의사 정보를 담은 DOCTOR 테이블입니다. DOCTOR 테이블은 다음과 같으며 DR_NAME, DR_ID, LCNS_NO, HIRE_YMD, MCDP_CD, TLNO는 각각 의사이름, 의사ID, 면허번호, 고용일자, 진료과코드, 전화번호를 나타냅니다.'
  });

   
};




// Define State Schema
const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  questionType: Annotation<string>,

});

// Get last user input from messages
function getLastUserMessage(state: typeof StateAnnotation.State) {
  let trimmedHistory = state.messages;
  const lastMessage = trimmedHistory.at(-1);

  // Make the user's question the most recent message in the history.
  // This helps small models stay focused.
  if (lastMessage && lastMessage._getType() === "ai") {
    trimmedHistory = trimmedHistory.slice(0, -1);
  }

  // 이제 trimmedHistory를 안전하게 사용할 수 있습니다.
  return trimmedHistory; // 예시로 마지막 사용자 메시지를 반환
}

function LastMessageContent(state: typeof StateAnnotation.State) {
  const lastMessage = state.messages.at(-1);
  if (!lastMessage) return "";

  let content = "";

  // LangChain 메시지 타입이라면
  if (typeof lastMessage.content === "string") {
    content = lastMessage.content;
  }

  // content가 배열일 수도 있으니 확인
  else if (Array.isArray(lastMessage.content)) {
    const userMsg = lastMessage.content
      .filter((m: any) => m.role === "user")
      .at(-1);

    if (userMsg) {
      content = userMsg.content;
    }
  }

  return content;
}



// 1. JudgeIntent node
const judgeIntent = async (state: typeof StateAnnotation.State, config: LangGraphRunnableConfig ) => {
 
  const question = LastMessageContent(state)

  if(state.messages.length==1){
    //경우에
   await  updateMemory(state,config)
  }

 // const store = config.store;
 // // Get the user id from the config
 // const userId = config.configurable?.user_id;
 // const memories = await store?.search([userId, "memories"]);
 // const messages_message = memories?.map(item => item.value.message);
 const systemPrompt = `
 사용자의 질문을 다음 두 가지 범주 중 하나로 분류하세요.
 
 Teacher:
 - 사용자가 SQL 키워드(SELECT, WHERE, JOIN, ON 등)에 대한 **개념 설명**을 요청하는 경우
 - 물음표(?) 유무와 관계없이, 다음과 같은 표현이 포함된 문장
   - “~가 뭐야”, “~이 뭔가요”
   - “~하는 법 알려줘”, “~설명해줘”
   - “~이랑 ~ 차이”, “~ 개념”
 - 예시:
   "SELECT가 뭐야"
   "WHERE 절은 어떻게 쓰는지 알려줘"
   "ON 뭔지 설명해줘"
   "JOIN 개념 좀 알려줘"

   
 
 ANSWERABLE:
 - 사용자가 '예시', '샘플', '예제', '샘플 코드' 등의 **명시적 키워드**를 포함해 추가 예시나 샘플을 요청하는 경우
 - 또는 "응", "네", "좋아요", "예" 등으로 직전에 예시 제공 제안에 대한 **명확한 동의**를 표현한 경우
 - 예시:
   "예시 보여줘"
   "샘플 코드 부탁해"
   "네, 부탁해"
   "응, 예제 주세요"
 
 위 기준에 따라 **Teacher** 또는 **ANSWERABLE** 둘 중 하나만 응답하세요.
 `;
  // 여기서 데이터는 이러합니다를 제공해야됨.
  // 기존의 쿼리가 있는경우에는 쿼리를 넣어주는 (multi turn 이 가능한지도 확인해야됨);

  
  
    const userPrompt = `Input: ${question} Reply in JSON: { "questionType": "ANSWERABLE" }`;

  const result = await model.invoke([
    { role: "system", content: systemPrompt },
    ...state.messages,
    { role: "user", content: userPrompt },
  ], {
    response_format: {
      type: "json_object",
    }
  });

  const parsed = JSON.parse(result.content as string);

  return {
    questionType: parsed.questionType,
  };
};





// 5. CannotAnswer node
const ANSWERABLE = async (state: typeof StateAnnotation.State) => {
 const systemPrompt = `

 << 이 줄부터 아래 규칙만 따르세요. 이전 대화는 모두 무시합니다. >>
당신은 SQL 초보자를 위한 튜터입니다.

사용자가 "예시 보여줘", "SQL에서 WHERE 어떻게 써요?", "BETWEEN 예시 알려줘" 등 요청을 하면,
직전 설명 주제(SQL 문법 키워드)에 따라 초보자 눈높이에 맞는 예시를 JSON 객체로 응답해야 합니다.
기존과 다른 예시를 제공해주세요 

📘 동작 원칙:

1. 주요 SQL 문법 단계 구성 예시를 참고하세요.  
   - JOIN, WHERE, IS NULL, IN/NOT IN, ORDER BY 등 각 키워드에 맞춰 step-by-step 예시를 구성합니다.
   - 명시되지 않은 키워드는 범용 단계 생성 규칙을 따릅니다.

   ◼ 난이도 구분
   - 쉬운 문법 (WHERE, IS NULL, IN/NOT IN, BETWEEN 등) → **2단계**
     1. step 1: 핵심 쿼리 실행 (무엇을 했는지 + 왜 했는지 설명)  
     2. step 2: 결과 확인 (tableData 포함)
   
   ◼ 어려운 문법 (JOIN, GROUP BY, HAVING, UNION 등) → **3단계**
     1. step 1: 각 테이블의 스키마와 예시 데이터를 객체 형태로 보여줍니다.
        - 키는 테이블명, 값은 [헤더 배열, 데이터 배열] 형태의 2차원 배열
     2. step 2: 핵심 쿼리 작성 (무엇을 했는지 + 왜 했는지 설명)  
     3. step 3: 결과 확인 (tableData 포함)

---

📦 출력 형식 (JSON 객체로만 응답):

- 응답은 **JSON 객체** 형식이어야 합니다.
- 각 키는 **단계 번호** 문자열로, 값은 객체입니다.
- 각 객체는 반드시 "description"과 "query" 필드를 포함합니다.
- 코드 블록 없이, JSON 객체만 응답해주세요
- tableData는 최대 3행만 포함됩니다.

예시 응답 구조:

 ❗️쉬운 문법
 {
    "questionType": "ANSWERABLE",
    "message": [
     {
    "description": "전체 테이블을 봅니다.",
    "query": "SELECT * FROM Students"
    "step":"1"
  },
   {
    "description": "WHERE 절을 적용한 결과입니다.",
    "query": "SELECT * FROM Students WHERE Score >= 90;",
    "tableData": [[
      ["StudentID","Name","Score"], //최대 3개만
      [[2,"Bob",92],[4,"Daisy",95]] 
    ]
    
    ],
    "step":"2"
  }
}}
    ]
  }
  
  ❗️ 어려운 문법
  {
  "questionType": "ANSWERABLE",
  "message": [
    {
      "step": "1",
      "description": "Employees와 Departments 테이블의 스키마와 예시 데이터를 확인합니다.",
      "tableData": [
    [
          ["EmployeeID", "Name", "DeptID"],
          [
            [1, "Alice", 1],
            [2, "Bob", 2],
            [3, "Charlie", 1]
          ]
    ],
         [
          ["ID", "DeptName"], 
          [
            [1, "HR"],
            [2, "IT"]
          ]
        ]
]
    },
    {
      "step": "2",
      "description": "Employees.DeptID와 Departments.ID가 일치하는 행만 내부 조인(INNER JOIN)하여 각 직원의 이름(Name)과 부서명(DeptName)을 조회합니다.",
      "query": "SELECT e.Name, d.DeptName\\nFROM Employees e\\nINNER JOIN Departments d ON e.DeptID = d.ID;"
    },
    {
      "step": "3",
      "description": "조인 결과를 확인하여 각 직원이 속한 부서를 확인합니다.",
    "tableData": [
        [                     // ← 바깥 배열 안에 단 하나의 테이블 세트
          ["Name","DeptName"],      // 헤더
          [
            ["Alice","HR"],
            ["Bob","IT"],
            ["Charlie","HR"]
          ]
        ]
]
    }
  ]
}


  ❗️주의사항:
  - 출력은 무조건 JSON 객체만 포함되어야 하며, 
 - 설명이나 코드 블록(\`\`\`)도 없이 JSON만 출력해주세요.

  `

    const result = await model.invoke([
      { role: "system", content: systemPrompt},
     ...state.messages,
  
    ]);


   
    return {
      messages:result
    };
  
};

// 6. RespondPolitely node
const Teacher = async (state: typeof StateAnnotation.State) => {
  
  const systemPrompt = `
  당신은 SQL 기초를 초보자에게 쉽게 설명해 주는 선생님입니다.
  
  🧠 설명 원칙:
  1. 복잡한 용어 없이 핵심만 간단하게 설명하세요.
  2. "예를 들어", "예시는 다음과 같습니다" 같은 표현은 절대 사용하지 마세요.
  3. 설명은 하나의 문장만 작성하고, 그 문장의 끝에 반드시 다음 문장을 붙이세요:
     👉 "예시가 필요하신가요?"
     (즉, 하나의 문장으로 자연스럽게 연결되어야 함)
  
  📦 출력 형식은 반드시 아래 JSON 객체처럼 작성해야 합니다:
  
  {
    "questionType": "Teacher",
    "message": [
      "설명문장... 예시가 필요하신가요?"
    ]
  }
  
  ❗️주의사항:
  - message 배열에는 **오직 하나의 문자열만** 포함되어야 합니다.
  - 출력은 무조건 JSON 객체만 포함되어야 하며, 그 외 텍스트는 절대 포함하지 마세요.
   코드 블록(\`\`\`)도 없이 JSON만 출력해주세요.
  `;
  // userPrompt 제거
  const result = await model.invoke([
    { role: "system", content: systemPrompt },
    ...state.messages,
  ]);
  
 
  return {
    messages:result
  };


};

// Graph 정의
let builder = new StateGraph(StateAnnotation)
.addNode("JudgeIntent", judgeIntent)
.addNode("Teacher", Teacher)
.addNode("ANSWERABLE", ANSWERABLE)

.addEdge("__start__", "JudgeIntent")


builder.addConditionalEdges("JudgeIntent", async (state) => {
  
  switch (state.questionType) {

        case "Teacher": return "Teacher";
        case "ANSWERABLE": return "ANSWERABLE"
 
    default: throw new Error(`Unknown questionType: ${state.questionType}`);
  }
}, {
    Teacher: "Teacher",
    ANSWERABLE: "ANSWERABLE",

});
builder.addEdge("Teacher", "__end__");
builder.addEdge("ANSWERABLE", "__end__");


const checkpointer = new MemorySaver();

const sqlGraph_flow = builder.compile({
  checkpointer,
  store: inMemoryStore
});
export default sqlGraph_flow;