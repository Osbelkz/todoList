import {RequestStatusCodes, todolistsAPI, TodolistType} from "../api/todolists-a-p-i";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {handleServerAppError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists",
    async (params, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistsAPI.getTodolists()
        try {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolists: res.data}
        } catch (e) {
            handleServerAppError(e, dispatch)
            return rejectWithValue(null)
        }
    })

export const removeTodolistsTC = createAsyncThunk("todolists/removeTodolists",
    async (params: { todolistId: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTodolistEntityStatusAC({status: "loading", id: params.todolistId}))
        const res = await todolistsAPI.deleteTodolist(params.todolistId)
        try {
            return {todolistId: params.todolistId}
        } catch (e) {
            handleServerAppError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(setAppStatusAC({status: "succeeded"}))
        }
    })

export const addTodolistsTC = createAsyncThunk("todolists/addTodolists",
    async (params: { title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistsAPI.createTodolist(params.title)
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                return {todolist: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerAppError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(setAppStatusAC({status: "succeeded"}))
        }
    })
export const changeTodolistTitleTC = createAsyncThunk("todolists/changeTodolistTitle",
    async (params: { id: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistsAPI.updateTodolist(params.id, params.title)
        if (res.data.resultCode === RequestStatusCodes.success) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolistId: params.id, newTitle: params.title}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }

    })

const slice = createSlice({
    name: "todolists",
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, newFilter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.newFilter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        })
        builder.addCase(removeTodolistsTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistsTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.newTitle
        })
    }
})

export const todolistsReducer = slice.reducer
export const {changeTodolistEntityStatusAC, changeTodolistFilterAC} = slice.actions

//THUNKS


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
