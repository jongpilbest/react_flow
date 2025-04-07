import { createSlice } from '@reduxjs/toolkit';



export const userSlice = createSlice({
    name: "Node",
    initialState: {
        nodes:[{
            id: '1',
            type: 'Node',
            position: { x: 250, y: 25 },
            children:[]
        },
    
      ],
        
        edges:{}
    },

    reducers: {
        addChildNode: (state, action) => {
          //어쩌피 map 은 여기 밑에서 작동하니까 부모 노드의 시작 포지션을 먼저 주고 증가하는식으로 
     
          // 부모노드가 시작하는곳 + width 의 길이를 주어줌 그거에 20만 더해서 간다고 생각하면되고 그거를 position 으로 줌줌 

          
            const { data,nodetype,id,position } = action.payload

            const newNode = {
              id: id.toString(),
              type: nodetype,
              data: data,
              position: {
                x:position[0],
                y:position[1]
              } ,
              children:[]
            };   

            
            state.nodes = [...state.nodes,newNode]; 
         
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