import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "../api/todolists-a-p-i";
import {setIsLoggedInAC} from "../features/Auth/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppStateType = typeof initialState

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    init: false
}

export const authMeTC = createAsyncThunk("app/initApp", async (param, {dispatch}) => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}))
    } else {

    }
    dispatch(setAppStatusAC({status: 'failed'}))
})

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(authMeTC.fulfilled, (state, action)=> {
            state.init = true
        })
    }
})


export const appReducer = slice.reducer;
export const {setAppErrorAC, setAppStatusAC} = slice.actions;
