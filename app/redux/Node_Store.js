import { createSlice } from '@reduxjs/toolkit';



export const userSlice = createSlice({
    name: "Node",
    initialState: {
       "nodes": [

          



  //      {
  //        "id": "1",
  //        "data": {
  //          "name": "From",
  //          "des": "employees 테이블에서 e 별칭",
  //          "sql": "FROM employees e"
  //        },
  //        "position": { "x": 0, "y": 0 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "2",
  //        "data": {
  //          "name": "From",
  //          "des": "departments 테이블에서 d 별칭",
  //          "sql": "FROM departments d"
  //        },
  //        "position": { "x": 250, "y": 0 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "3",
  //        "data": {
  //          "name": "Join",
  //          "des": "e.department_id = d.department_id 기준으로 조인",
  //          "sql": "JOIN departments d ON e.department_id = d.department_id"
  //        },
  //        "position": { "x": 125, "y": 150 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "4",
  //        "data": {
  //      "name": "Filter",
  //          "des": "WHERE 절 시작",
  //          "sql": "WHERE e.salary > (\n    SELECT AVG(salary)\n    FROM employees\n    WHERE department_id IN (\n        SELECT department_id\n        FROM departments\n        WHERE location_id = (\n            SELECT location_id\n            FROM locations\n            WHERE city = 'New York'\n        )\n    )\n)\nAND e.hire_date > (\n    SELECT MIN(hire_date)\n    FROM employees\n    WHERE job_id LIKE 'SA%'\n)"
  //        },
  //        "position": { "x": 125, "y": 300 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "5",
  //        "data": {
  //          "name": "Sub query",
  //          "des": "AVG(salary) 반환 (location_id 기준)",
  //          "sql": "SELECT AVG(salary)\n    FROM employees\n    WHERE department_id IN (\n        SELECT department_id\n        FROM departments\n        WHERE location_id = (\n            SELECT location_id\n            FROM locations\n            WHERE city = 'New York'\n        )\n    )"
  //        },
  //        "position": { "x": 425, "y": 300 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "6",
  //        "data": {
  //          "name": "Sub query",
  //          "des": "department_id 목록 반환",
  //          "sql": "SELECT department_id\n        FROM departments\n        WHERE location_id = (\n            SELECT location_id\n            FROM locations\n            WHERE city = 'New York'\n        )"
  //        },
  //        "position": { "x": 625, "y": 300 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "7",
  //        "data": {
  //          "name": "Sub query",
  //          "des": "location_id 반환 (city='New York')",
  //          "sql": "SELECT location_id\n            FROM locations\n            WHERE city = 'New York'"
  //        },
  //        "position": { "x": 825, "y": 300 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "8",
  //        "data": {
  //          "name": "Filter",
  //          "des": "e.hire_date가 최소 hire_date보다 큰 경우",
  //          "sql": "e.hire_date > (\n    SELECT MIN(hire_date)\n    FROM employees\n    WHERE job_id LIKE 'SA%'\n)"
  //        },
  //        "position": { "x": 125, "y": 450 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "9",
  //        "data": {
  //          "name": "Sub query",
  //          "des": "MIN(hire_date) 반환 (job_id LIKE 'SA%')",
  //          "sql": "SELECT MIN(hire_date)\n    FROM employees\n    WHERE job_id LIKE 'SA%'"
  //        },
  //        "position": { "x": 425, "y": 450 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "10",
  //        "data": {
  //          "name": "Where",
  //          "des": "모든 필터링 완료",
  //          "sql": "WHERE 조건 모두 충족"
  //        },
  //        "position": { "x": 125, "y": 600 },
  //        "type": "NewNL"
  //      },
  //      {
  //        "id": "11",
  //        "data": {
  //          "name": "Select",
  //          "des": "최종 컬럼 선택",
  //          "sql": "SELECT e.employee_name, d.department_name"
  //        },
  //        "position": { "x": 125, "y": 750 },
  //        "type": "NewNL"
  //      } 
////
  //{//
  //  "i//d": "1",
  //  "d//ata": {
  //    //"name": "From employees",
  //    //"des": "employees 테이블에서 e 별칭",
  //    //"sql": "FROM employees e"
  //  },//
  //  "p//osition": { "x": 0, "y": 0 },
  //  "t//ype": "NewNL"
  //},//
  //{//
  //  "i//d": "2",
  //  "d//ata": {
  //    //"name": "From departments",
  //    //"des": "departments 테이블에서 d 별칭",
  //    //"sql": "FROM departments d"
  //  },//
  //  "p//osition": { "x": 250, "y": 0 },
  //  "t//ype": "NewNL"
  //},//
  //{//
  //  "i//d": "3",
  //  "data": {
  //    "name": "Inner Join",
  //    "des": "e.department_id = d.department_id 기준으로 조인",
  //    "sql": "JOIN departments d ON e.department_id = d.department_id"
  //  },
  //  "position": { "x": 125, "y": 150 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "4",
  //  "data": {
  //    "name": "Filter",
  //    "des": "WHERE 절 시작",
  //    "sql": "WHERE e.salary >  AND e.hire_date > "
  //  },
  //  "position": { "x": 125, "y": 300 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "5",
  //  "data": {
  //    "name": "서브쿼리 1 ",
  //    "des": "AVG(salary) 반환 (location_id 기준)",
  //    "sql": "SELECT AVG(salary) FROM employees WHERE department_id IN"
  //  },
  //  "position": { "x": 425, "y": 300 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "6",
  //  "data": {
  //    "name": "서브쿼리 1-1 ",
  //    "des": "department_id 목록 반환",
  //    "sql": "SELECT department_id FROM departments WHERE location_id ="
  //  },
  //  "position": { "x": 625, "y": 300 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "7",
  //  "data": {
  //    "name": "서브쿼리 1-2 ",
  //    "des": "location_id 반환 (city='New York')",
  //    "sql": "SELECT location_id FROM locations WHERE city = 'New York'"
  //  },
  //  "position": { "x": 825, "y": 300 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "8",
  //  "data": {
  //    "name": "Filter",
  //    "des": "e.hire_date가 최소 hire_date보다 큰 경우",
  //    "sql": "e.hire_date > "
  //  },
  //  "position": { "x": 125, "y": 450 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "9",
  //  "data": {
  //    "name": "서브쿼리 2 ",
  //    "des": "MIN(hire_date) 반환 (job_id LIKE 'SA%')",
  //    "sql": "SELECT MIN(hire_date) FROM employees WHERE job_id LIKE 'SA%'"
  //  },
  //  "position": { "x": 425, "y": 450 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "10",
  //  "data": {
  //    "name": "Where",
  //    "des": "모든 필터링 완료",
  //    "sql": "WHERE 조건 모두 충족"
  //  },
  //  "position": { "x": 125, "y": 600 },
  //  "type": "NewNL"
  //},
  //{
  //  "id": "11",
  //  "data": {
  //    "name": "Select",
  //    "des": "최종 컬럼 선택",
  //    "sql": "SELECT e.employee_name, d.department_name"
  //  },
  //  "position": { "x": 125, "y": 750 },
  //  "type": "NewNL"
  //}
]
,
        edges:[
          //{ "source": "1", "target": "3", "id":"1", animated: true, },
          //{ "source": "2", "target": "3", "id":"2", animated: true, },
          //{ "source": "3", "target": "4", "id":"3", animated: true, },
          //{ "source": "4", "target": "5", "id":"4", animated: true, },
          //{ "source": "5", "target": "6", "id":"5", animated: true, },
          //{ "source": "6", "target": "7", "id":"6", animated: true, },
          //{ "source": "7", "target": "4", "id":"7", animated: true, },
          //{ "source": "4", "target": "8", "id":"8", animated: true, },
          //{ "source": "8", "target": "9", "id":"9", animated: true, },
          //{ "source": "9", "target": "10", "id":'10', animated: true, },
          //{ "source": "10", "target": "11","id":'11', animated: true, }
        ],
        new_Sql :'',
        sql_query:''

    },

    reducers: {

    add_renew_Node:(state,action)=>{
      state.nodes=action.payload.data.nodes;
      state.edges=action.payload.data.edges;
    },
    add_new_sql:(state,action)=>{
      state.new_Sql= action.payload;
    },
    add_sql_query:(state,action)=>{
      state.sql_query= action.payload;
    },
      addFlowChildNode:(state,action)=>{
        //처음에 있는 children의child 만 수정하면될거 같은데 
       //action.payload.start

        for (const el in action.payload.data) {
       
              //state.nodes[el] = action.payload.data[el]; 
              if( el==action.payload.start){
                state.nodes[el] = action.payload.data[el];
                state.nodes['1'].children.push(action.payload.start)
              }
              else{
                //없는경우에는 여기가 잘못되서 글런가..? 아이디 없을때 달라고 해야되나 
                
                 if(!state.nodes[el])  state.nodes[el] = action.payload.data[el];
              }
            
             
        }
       
        
      },

        addChildNode: (state, action) => {
  
       
            for (const el in action.payload.data) {
                if (state.nodes[el]) {
                  // 기존 노드가 존재하면 → 그걸 업데이트
                  state.nodes[el] = {
                    ...state.nodes[el],
                    ...action.payload.data[el],
                  };
                }
                else{
                  //없는경우에는 
                  state.nodes[el] = action.payload.data[el];
                 
                }
  
              }
            
              
           
          },

          Node_click:(state,action)=>{
            state.Node_click=action.payload
          }
    },
});

export const { addChildNode ,addFlowChildNode,add_renew_Node ,Node_click ,add_new_sql, add_sql_query} = userSlice.actions;

export default userSlice.reducer;

