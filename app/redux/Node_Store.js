import { createSlice } from '@reduxjs/toolkit';


import {initialTree} from './Intial_node'
export const userSlice = createSlice({
    name: "Node",
    initialState: {
        nodes:initialTree,
        edges:[]
    },

    reducers: {

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
            
              
           
          }
    },
});

export const { addChildNode ,addFlowChildNode } = userSlice.actions;

export default userSlice.reducer;

