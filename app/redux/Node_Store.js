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

export const { addChildNode } = userSlice.actions;

export default userSlice.reducer;

