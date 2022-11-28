import {createSlice} from "@reduxjs/toolkit"

const initialState = {auth: false}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (state, action) => {
            if (state.auth) return state
            else return {...state, ...action.payload, auth: true}
        },
        updateUser: (state, action) => {
            return {...state, ...action.payload}
        },
        logoutUser: () => initialState
    }
})

export const {logoutUser, loginUser, updateUser} = userSlice.actions

export default userSlice.reducer