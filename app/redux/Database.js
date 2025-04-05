import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: "user",
    initialState: {
        db1:{},
        db2:{},
        open:false
    },
    reducers: {
        store_db: (state, action) => {
            state[action.payload.name] = action.payload.db;
        },
        change_open:(state,action)=>{
            state.open= !state.open
        }
    },
});

export const { store_db,change_open } = userSlice.actions;

export default userSlice.reducer;


