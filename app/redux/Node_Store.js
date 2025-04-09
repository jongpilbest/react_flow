import { createSlice } from '@reduxjs/toolkit';


import {initialTree} from './Intial_node'
export const userSlice = createSlice({
    name: "Node",
    initialState: {
        nodes:initialTree,
        edges:[]
    },

    reducers: {
        addChildNode: (state, action) => {
  
         //부모 노드의 아이디를 받아와야한다. 
         //action.id 형식으로 받아오자
        
          //const parent_id= action.payload.parent_id;
          //// parent_id 는 string 형식이다. 따라서 parseint 으로 바꾸고 다시 string으로 
          //const children_id=action.payload.child_id;
        //
          


           //inital Tree parent 수정하고 자식으로 넣으면 될까?
           //const newTree =JSON.parse(action.payload)
           // JSON.parse(JSON.stringify(initialTree));
          //newTree[parent_id].children.push(children_id);
          //const newNode={
          // [children_id]: {
          //   id: children_id,
          //   isChildren: true,
          //   data:[action.payload.sql, action.payload.description],
          //   type:'Child'
          // },
          //}
    //   
            
            //state.nodes = {...action.payload.data}; 
            for (const el in action.payload.data) {
                if (state.nodes[el]) {
                  // 기존 노드가 존재하면 → 그걸 업데이트
                  state.nodes[el] = {
                    ...state.nodes[el],
                    ...action.payload.data[el],
                  };
                }
              }
              
              // 새 노드 추가 (겹치는 키가 있으면 업데이트됨)
              state.nodes = {
                ...state.nodes,
                ...action.payload.newSql
              };
              
        //   for (const el in action.payload.data){
        //      if(state.nodes.el) {
        //        // 가 있따면 
        //        state.nodes[el]= action.payload.data[el];
        //        //으로 바꿔주세요가 되는거 맞지
        //      }        
        //   }
        //  state.nodes={...state.nodes,...action.payload.newSql}
          // 기존 노드를 수정하고 새로운 노드는 추가해주세요가 되는거 맞지?
          }
    },
});

export const { addChildNode } = userSlice.actions;

export default userSlice.reducer;


//const initialNodes = [
//    {
//      id: '1',
//      type: 'Node',
//      data: { label: 'Input Node' },
//      position: { x: 250, y: 25 },
//    },
//    {
//        id: '2',
//        type: 'Child',
//        data: { label: 'Input Node' },
//        position: { x: 350, y: 35 },
//      },
//    
//  ];