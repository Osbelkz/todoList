import {RequestStatusCodes, todolistsAPI, TodolistType} from "../../api/todolists-a-p-i";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import { ThunkErrorType } from "../../utils/redux-help-types";

const fetchTodolists = createAsyncThunk("todolists/fetchTodolists",
    async (params, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistsAPI.getTodolists()
        try {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolists: res.data}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
const removeTodolist = createAsyncThunk("todolists/removeTodolists",
    async (params: { todolistId: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTodolistEntityStatus({status: "loading", id: params.todolistId}))
        const res = await todolistsAPI.deleteTodolist(params.todolistId)
        try {
            return {todolistId: params.todolistId}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
const addTodolist = createAsyncThunk<{todolist: TodolistType }, { title: string },
    ThunkErrorType
    >("todolists/addTodolists",
    async (params, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistsAPI.createTodolist(params.title)
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                return {todolist: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch, false)
                return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (e) {
            const error: AxiosError = e
            handleServerAppError(e, dispatch, false)
            return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
    })
const changeTodolistTitle = createAsyncThunk("todolists/changeTodolistTitle",
    async (params: { id: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        try {
            const res = await todolistsAPI.updateTodolist(params.id, params.title)
            if (res.data.resultCode === RequestStatusCodes.success) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                return {todolistId: params.id, newTitle: params.title}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (e) {
            const error: AxiosError = e
            handleServerAppError(e, dispatch, false)
            return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }


    })

export const asyncActions = {
    fetchTodolists,
    removeTodolist,
    addTodolist,
    changeTodolistTitle
}

export const slice = createSlice({
    name: "todolists",
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ todolistId: string, newFilter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.newFilter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        })
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolist.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        })
        builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.newTitle
        })
    }
})

export const todolistsReducer = slice.reducer
export const {changeTodolistEntityStatus, changeTodolistFilter} = slice.actions
//THUNKS


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
