'use client';

import React, { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSelector, useDispatch } from 'react-redux';
import { addChildNode } from '@/app/redux/Node_Store';
import Child_Component from '../child_node/Child_Component';
import { v4 as uuidv4 } from 'uuid';
import { modal_struction } from './modal_struction'
import { Loader, CircleHelp } from 'lucide-react'

// 🔥 react-markdown 추가
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ModalInner({ id, setopen, description }) {
 
  const reduxNodes = useSelector((state) => state.node.nodes);
  const original_Sql= useSelector((state)=>state.node.new_Sql);
  const sql_query= useSelector((state)=>state.node.sql_query);
  const nodesArray = Object.values(reduxNodes);  // 객체를 배열로 변환
   



  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rawText, setRawText] = useState('');

  // ✅ 스트리밍된 rawText 변환
  useEffect(() => {
    if (!rawText) return;

    // 그냥 Markdown 그대로 넘겨서 ReactMarkdown이 렌더링하게 함
    setMessages(prev => [...prev, { role: 'assistant', content: rawText }]);
  }, [rawText]);

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!input.trim()) return;
    setPending(true);

    try {
      const input_result = input;
      setMessages(prev => [...prev, { role: 'user', content: input_result }]);
      setRawText('');

      const response = await fetch('/api/Flow', {
        method: 'POST',
        body: JSON.stringify({ input_result: input_result.toUpperCase(), id: id, 
          sql_query:sql_query,
          Node:nodesArray ,sql: nodesArray[id-1].data.sql ,dummy:original_Sql }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let partialText = '';
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk; // ✅ 조각 이어붙이기
      
          // 줄 단위로 나누기
          let lines = buffer.split('\n');
      
          // 마지막 줄은 완성 안 됐을 수 있으니까 빼고
          buffer = lines.pop() || '';
      
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const dataStr = line.replace('data:', '').trim();
      
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
      
              try {
                const parsed = JSON.parse(dataStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  partialText += content;
                }
              } catch (err) {
                console.error('파싱 에러 (dataStr 문제):', dataStr, err);
                // 오류 무시하고 계속 진행
              }
            }
          }
        }
        done = doneReading;
      }

      // ✅ 스트리밍 끝나고 AI 메시지 추가
      setMessages(prev => [...prev, { role: 'assistant', content: partialText }]);
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className='relative'>
      <div className="absolute p-3 w-full bottom-0 translate-y-full flex justify-between z-50 bg-white">
       
        <button
          disabled={pending}
          onClick={handleSubmit}
          className={`p-3 flex w-24 justify-between h-8 items-center text-white bg-pink-400 ${pending ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          <CircleHelp className='stroke-white' size={25} />
          Search
        </button>
      </div>

      <div className='p-3 bg-pink w-full grid gap-2'>
        <div className='w-full h-[500px] overflow-y-auto'>
          {pending && <Loader size={18} className='animate-spin stroke-blue-800' />}

          {/* ✅ 질문/답변 순서대로 출력 */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap my-2 w-full flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user'
                  ? 'bg-blue-400 text-white rounded-br-none'
                  : 'bg-gray-200 text-black rounded-bl-none'
                }`}
              >
                <p className="text-xs font-semibold mb-1">{msg.role === 'user' ? 'User' : 'AI'}</p>

                {/* 🔥 dangerouslySetInnerHTML 대신 ReactMarkdown */}
                <ReactMarkdown   remarkPlugins={[remarkGfm]}
  components={{
    table: ({node, ...props}) => (
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
        marginBottom: '10px',
      }} {...props} />
    ),
    th: ({node, ...props}) => (
      <th style={{
        border: '1px solid #ddd',
        padding: '8px',
        backgroundColor: '#f2f2f2',
        textAlign: 'left',
        whiteSpace: 'nowrap'
      }} {...props} />
    ),
    td: ({node, ...props}) => (
      <td style={{
        border: '1px solid #ddd',
        padding: '8px',
        whiteSpace: 'nowrap'
      }} {...props} />
    ),
    p: ({node, ...props}) => (
      <p style={{
        marginTop: '8px',
        marginBottom: '8px',
        lineHeight: '1.5',
      }} {...props} />
    ),
    h1: ({node, ...props}) => (
      <h1 style={{
        fontSize: '1.5em',
        fontWeight: 'bold',
        marginTop: '16px',
        marginBottom: '8px',
      }} {...props} />
    ),
    h2: ({node, ...props}) => (
      <h2 style={{
        fontSize: '1.25em',
        fontWeight: 'bold',
        marginTop: '14px',
        marginBottom: '8px',
      }} {...props} />
    ),
    h3: ({node, ...props}) => (
      <h3 style={{
        fontSize: '1.1em',
        fontWeight: 'bold',
        marginTop: '12px',
        marginBottom: '6px',
      }} {...props} />
    ),
    ul: ({node, ...props}) => (
      <ul style={{
        paddingLeft: '20px',
        marginTop: '8px',
        marginBottom: '8px',
      }} {...props} />
    ),
    li: ({node, ...props}) => (
      <li style={{
        marginBottom: '4px'
      }} {...props} />
    ),
  }}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <button
        onClick={(e)=> {
          setInput('예시데이터를 알려줘')
          handleSubmit(e)
        }}
        className='bg-blue-400  h-8 w-20 text-white'>예시데이터</button>
        <form className="w-full flex-grow-[1] flex items-center py-4" onSubmit={handleSubmit}>
          <Textarea
            value={input}
            name="prompt"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Please enter SQL query"
          />
        </form>
      </div>
    </div>
  );
}

export default React.memo(ModalInner);
