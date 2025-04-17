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
 - 사용자가 SQL 문법, 쿼리 작성법, 또는 SQL 사용 방법 등 SQL 관련 질문을 던졌을 경우.
 - 예를 들어, "SELECT 문의 사용법을 알려줘", "WHERE 절은 어떻게 사용해?" 등 SQL 기초에 관한 질문.
 
 ANSWERABLE:
 - 사용자가 이전 SQL 설명 이후 "예시가 필요해?"라는 질문에 대해 긍정적인 의사를 표현한 경우.
 - 예를 들어, 단순히 "응", "그래", "좋아" 등으로 응답해서 추가 예시 제공을 요청한 경우.
 
 다음 중 하나로만 응답하세요: Teacher, ANSWERABLE
 `;

  // 여기서 데이터는 이러합니다를 제공해야됨.
  // 기존의 쿼리가 있는경우에는 쿼리를 넣어주는 (multi turn 이 가능한지도 확인해야됨);

  
  
    const userPrompt = `Input: ${question} Reply in JSON: { "questionType": "ANSWERABLE" }`;

  const result = await model.invoke([
    { role: "system", content: systemPrompt },
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
    당신은 사용자가 예시 요청 시, 바로 직전의 설명 내용을 참고하여 아래 형식의 예시를 JSON 객체로 출력하는 역할을 합니다.
    반드시 오직 아래 JSON 형식으로  반환해 주세요:
    
    {
      "tableData": [
        ["ID", "Name", "Score"],
        [
          [1, "Alice", 90],
          [2, "Bob", 85],
          [3, "Charlie", 95]
        ]
      ]
    },
   
    
    
    단, tableData 안의 데이터는 직전 설명 내용과 관련된 실제 예시로 대체될 수 있습니다.
    오직 JSON 객체 형식의 결과만 제공해 주세요.
    `;

    const userPrompt = `
    Return a valid Json object like this format Only this turn :
    {
      "questionType": "ANSWERABLE",
      "message": [
        "생성한 tableData",
        "생성한 tabel Data 에 대한 설명" 
      ]
    }
    `;
    const result = await model.invoke([
      { role: "system", content: systemPrompt},
      ...state.messages,
      {
        role: "user",
        content: userPrompt
      }
  
    ]);


   
    return {
      messages:result
    };
  
};

// 6. RespondPolitely node
const Teacher = async (state: typeof StateAnnotation.State) => {
    const userPrompt = `
    Return a valid Json object like this format Only this turn :
    {
      "questionType": "ANSWERABLE",
      "message": [
        "설명"
      ]
    }
    `;

 const systemPrompt = `당신은 SQL 기초를 초보자들에게 쉽게 설명해 주는 선생님입니다.사용자가 SQL 관련 질문을 하면, 복잡한 용어나 불필요한 정보를 배제하고 핵심 내용만 간단하게 설명해 주세요.`;
  const result = await model.invoke([
    { role: "system", content: systemPrompt},
    ...state.messages,
    {
        role: "user",
        content: userPrompt
      }
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