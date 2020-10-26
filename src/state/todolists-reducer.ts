import { TodolistType, todolistsAPI, RequestStatusCodes } from "../api/todolists-a-p-i";
import { RequestStatusType, setAppStatusAC, setAppErrorAC } from "./app-reducer";
import { Dispatch } from "redux";
import {handleServerAppError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{todolistId: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index,1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{todolist: TodolistType}>){
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{todolistId: string, newTitle: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.newTitle
        },
        changeTodolistFilterAC(state, action: PayloadAction<{todolistId: string, newFilter: FilterValuesType}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.newFilter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{id: string, status: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        setTodolistsAC(state, action: PayloadAction<{todolists: Array<TodolistType>}>){
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        },
    }
})

export const todolistsReducer = slice.reducer
export const {changeTodolistEntityStatusAC,
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC} = slice.actions

//THUNKS


export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status:"loading"}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC({todolists:res.data}))
                dispatch(setAppStatusAC({status:"succeeded"}))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status:"loading"}))
        dispatch(changeTodolistEntityStatusAC({status: "loading", id:todolistId} ))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC({todolistId:todolistId}))
            })
            .finally(() => dispatch(setAppStatusAC({status:"succeeded"})))
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status:"loading"}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({todolist:res.data.data.item}))
                    dispatch(setAppStatusAC({status:"succeeded"}))
                } else {
                    dispatch(setAppErrorAC({error: res.data.messages[0]}))
                    dispatch(setAppStatusAC({status:"failed"}))
                }
            })
            .catch( err => {
                if (err.data.resultCode === RequestStatusCodes.error) {
                    if (err.messages.length) {
                        dispatch(setAppErrorAC(err.messages[0]))
                    } else {
                        dispatch(setAppErrorAC({error: 'Some error occurred'}))
                    }
                    dispatch(setAppStatusAC({status:'failed'}))
                }
            })
            .finally(()=> {
                dispatch(setAppStatusAC({status:"succeeded"}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status:"loading"}))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === RequestStatusCodes.success) {
                    dispatch(changeTodolistTitleAC({todolistId: id, newTitle: title}))
                    dispatch(setAppStatusAC({status:"succeeded"}))
                } else handleServerAppError(res.data, dispatch)
            })
    }
}


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
