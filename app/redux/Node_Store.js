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
            
            state.nodes = {...action.payload.data}; 

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