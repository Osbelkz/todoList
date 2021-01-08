import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolists-a-p-i";
import { setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export const loginTC = createAsyncThunk<
    undefined, LoginParamsType,
    { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }
    >("auth/login",
    async (params, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}))

        try {
            const res = await authAPI.login(params)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return;
            } else {
                debugger
                handleServerAppError(res.data, thunkAPI.dispatch);
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (e) {
            const error: AxiosError = e
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
    })


export const logoutTC = createAsyncThunk("auth/logout",
    async (params, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
        try {
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return;
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch);
                return thunkAPI.rejectWithValue({})
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    })
export const asyncActions = {loginTC, logoutTC}

export const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true;
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = false;
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
//THUNKS
