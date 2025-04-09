// LangGraph-compatible Text-to-SQL Chatbot (updated using LangGraph v0.2 and TogetherAI-compatible flow)
import { z } from "zod";
import { AIMessage } from "@langchain/core/messages"
import { Annotation, MessagesAnnotation ,StateGraph , MemorySaver } from "@langchain/langgraph";

//import { createOpenAI } from "@ai-sdk/openai";
//
//const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
//const model= openai.chat('gpt-4')

import { ChatOpenAI } from "@langchain/openai";
const model = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-4o",
})

// Define State Schema
const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  questionType: Annotation<string>,
  sql:Annotation<string>
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
const judgeIntent = async (state: typeof StateAnnotation.State) => {
 
  const question = LastMessageContent(state)


  const systemPrompt = `
  당신은 사용자의 질문이 SQL 쿼리 생성을 위한 적합성에 따라 다음 네 가지 범주 중 하나로 분류하는 어시스턴트입니다.
  
  사용자의 질문을 다음 중 하나로 분류하세요:
  
   AMBIGUOUS:
  질문이 SQL을 생성하기에는 구체성이 부족합니다. 추가 질문 없이는 쿼리를 만들 수 없습니다.
  질문이 SQL 쿼리를 만들기엔 구체성이 부족함
  정보가 모호하거나 범위가 너무 넓음
  예: "정보 좀 알려줘", "판매 정보 보여줘"
  
   ANSWERABLE:
  질문이 구체적이고 명확합니다. SQL 쿼리를 만들기에 충분한 정보가 포함되어 있습니다.
  예시: "2023년 1월의 판매량을 알려줘", "가장 많이 팔린 상품은?"
  
  UNANSWERABLE:
  문법적으로는 괜찮지만, 관련 데이터가 존재하지 않거나 논리적으로 답할 수 없는 질문입니다.
  예시: "화성에서 가장 인기 있는 아이스크림은?", "2025년의 판매 데이터 알려줘" (데이터가 아직 없음)
  
   IMPROPER:
  SQL 작업과 관련 없는 메시지입니다. 인사말, 잡담, 감사 표현 등은 모두 IMPROPER 로 간주
  예: "고마워요!", "오늘 날씨 좋네요", "넌 멋져", "안녕"
  
  다음 중 하나로만 응답하세요: AMBIGUOUS, ANSWERABLE, UNANSWERABLE,IMPROPER.
  `;
  
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
    messages: state.messages,
  };
};

// 2. Clarifier node
const clarifier = async (state: typeof StateAnnotation.State) => {
  
 //명확하지 못한 데이터가 들어왔을때 . 모델이 따로 대답
 // 을 생산 굳이 안해도 될거같음
 //const msg = "죄송합니다. 해당 질문에 대한 정보를 가지고 있지 않습니다.";
 //return {
 //  messages: [...state.messages, { role: "assistant", content: msg }],
 //};
  const answer=" 죄송합니다. 더 많은 정보를 주시겠어요? 이해가 부족합니다. "
  const newMessage = new AIMessage({ content: `{
    "questionType": "AMBIGUOUS",
    "message": ${ JSON.stringify([answer])}
  }` });
  return {
    messages: newMessage
  };
};

// 3. SQL Generator node 여기는 원래 hugging face 에서 모델 가져와야되는데. 우선 그냥 chatgpt 한테 만들어달라고 하는공간


const generateSQL = async (state: typeof StateAnnotation.State) => {

  const userPrompt = `
  Return a valid Json object like this format Only this turn :
  {
    "questionType": "ANSWERABLE",
    "message": [
      "<Your SQL query here>",
      "<Short natural language explanation>"
    ]
  }
  `;
  const result = await model.invoke([
    { role: "system", content: "You are a SQL generator.  make a sql query and short natural query  " },
    ...state.messages,
    {
      role: "user",
      content: userPrompt
    }

  ], {
    response_format: { type: "json_object" }
    
  });

  return {
    messages:result
  };
};

// 4. RunQuery (mock)


// 5. CannotAnswer node
const cannotAnswer = async (state: typeof StateAnnotation.State) => {
  const msg = "죄송합니다. 해당 질문에 대한 정보를 가지고 있지 않습니다.";

  const newMessage = new AIMessage({ content: `{
    "questionType": "UNANSWERABLE",
    "message": ${ JSON.stringify([msg])}
  }` });
  return {
    messages: newMessage
  };
};

// 6. RespondPolitely node
const respondPolitely = async (state: typeof StateAnnotation.State) => {
  // improper 그냥 떠드는거 였음 그에 해당하는 답변은 새로 만드는게 날듯
  const userPrompt = `
  Return a valid Json object like this format Only this turn :
  {
    "questionType": "IMPROPER",
    "message": 
      ["<Chat answer>"]
  }
  `;
  const result = await model.invoke([
    { role: "system", content: "상대방 대답에 어울리는 대답을 간단하게 제공해줘 " },
    ...state.messages,
    {
      role: "user",
      content: userPrompt
    }
  ],{
    response_format: { type: "json_object" }
  });
 
  return {
    messages:result
  };


};

// Graph 정의
let builder = new StateGraph(StateAnnotation)
.addNode("JudgeIntent", judgeIntent)
.addNode("Clarifier", clarifier)
.addNode("GenerateSQL", generateSQL)
.addNode("CannotAnswer", cannotAnswer)
.addNode("RespondPolitely", respondPolitely)
.addEdge("__start__", "JudgeIntent")


builder.addConditionalEdges("JudgeIntent", async (state) => {
  
  switch (state.questionType) {
    case "AMBIGUOUS": return "clarifier";
    case "ANSWERABLE": return "sql";
    case "UNANSWERABLE": return "cannot";
    case "IMPROPER": return "polite";
    default: throw new Error(`Unknown questionType: ${state.questionType}`);
  }
}, {
  clarifier: "Clarifier",
  sql: "GenerateSQL",
  cannot: "CannotAnswer",
  polite: "RespondPolitely",
});
builder.addEdge("Clarifier", "__end__");
builder.addEdge("GenerateSQL", "__end__");
builder.addEdge("CannotAnswer", "__end__");
builder.addEdge("RespondPolitely", "__end__");

const checkpointer = new MemorySaver();
const sqlGraph = builder.compile({checkpointer});
export default sqlGraph;
