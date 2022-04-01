import { createSlice } from '@reduxjs/toolkit'

//USER SLICE
const userSlice = createSlice({
    name: "user",

    initialState: {
        value: {
            id: null,
            name: null,
            surname: null,
            fatherName: null,
            email: null,
            phoneNumber: null,
            birthday: null,
            username: null,
            role: null,
            avatar: null,
            token: null
        },
        users:{
           users: []
        }
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload
        },
        addUsers: (state, action) =>{
            state.users = action.payload
        }
    }
})

export const { login, addUsers } = userSlice.actions;

export const selectUser = (state) => state.user.value;
export const selectAddUser = (state) => state.user.users;

export default userSlice.reducer;