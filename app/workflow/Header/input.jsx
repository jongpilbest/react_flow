import React, { useEffect } from 'react'
import { useRef,useState } from "react";
import SQLViewer from "./Viewr";
import './style.css'
import { useDispatch ,useSelector } from 'react-redux';
import { useFormStatus } from 'react-dom';
import { Flow_chat } from './action';
import { add_renew_Node, add_new_sql,add_sql_query } from '@/app/redux/Node_Store';

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        className="h-8 p-3 flex items-center text-sm bg-blue-400 text-white rounded-md hover:bg-blue-600 transition"
        disabled={pending}
      >
        {pending ? 'Submitting...' : 'Generate'}
      </button>
    );
  }

  
export default function Monaco_Editor() {
    const dispatch = useDispatch();
    const [sqlText, setSqlText] = useState(fullSQLText);  
    const click_node = useSelector((state) => state.node.Node_click);
    useEffect(()=>{
      highlightSQLFragment(click_node)
    },[click_node])
    async function actionHandler(formData){


        //const reduxNodes = useSelector((state) => state.node.nodes);
      
         // const last_number_tree=Object.keys(reduxNodes).length+1;
         
         // 여기에다가 redux 으로 연결해서 전체 구절이 뭔지에 대해서 넣어야될듯

         
          formData.append('text', sqlText);
          const response= await Flow_chat(formData)
 
          dispatch(add_renew_Node({data:response }))
           
          const res = await fetch("/api/Dummy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input_result: response , real_sql : sqlText}),
          });
        
          if (!res.ok) {
            console.error("❌ API 호출 실패:", res.statusText);
            return;
          }
        
          const data = await res.json();
          //console.log(data.choices[0].message.content,'더미데이터')
          dispatch(add_new_sql(data.choices[0].message.content))
          dispatch(add_sql_query(sqlText));
          // 여기에 sqltext 을 연결함.

      }


    const editorRef = useRef(null);
    const [decorations, setDecorations] = useState([]);
    const handleEditorDidMount = (editor) => {
      editorRef.current = editor;
   
    };
  
    // ✨ 하이라이트 함수
    const highlightSQLFragment = (keyword) => {
        const editor = editorRef.current;
        if (!editor) return;
    
        const model = editor.getModel();
     
        const matches = model.findMatches(keyword, true, false, false, null, true);
    
        if (matches.length > 0) {
          const newDecorations = matches.map(match => ({
            range: match.range,
            options: {
              inlineClassName: "myHighlight"
            }
          }));
     
          // 여기! 기존 decoration 지우고 새로 반영
          const newIds = editor.deltaDecorations(decorations, newDecorations);
          setDecorations(newIds);  // 업데이트
        }
    };
  
    return (
      <div className=' py-2  w-[40%] h-full flex flex-col justify-between'>
      <div>
      <SQLViewer 
      onChange={(e)=>setSqlText(e)}
      sqlText={sqlText} 
      onEditorMount={handleEditorDidMount} />
      </div>
      <div className='h-full bg-white'>

      </div>
       <div className='h-24 flex   '>
       <form action={actionHandler} className="flex w-full items-center justify-end ">
        <SubmitButton />
      </form>
       </div>

    

      </div>
    );
}
const fullSQLText = `
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
`;

//<button 
//       className='bg-blue-400 h-[60%] '
//       onClick={() => highlightSQLFragment("FROM employees")}>FROM employees 하이라이트</button>