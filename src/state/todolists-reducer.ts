import { TodolistType, todolistsAPI, RequestStatusCodes } from "../api/todolists-a-p-i";
import { RequestStatusType, setAppStatusAC, SetAppStatusActionType, SetAppErrroActionType, setAppErrorAC } from "./app-reducer";
import { Dispatch } from "redux";
import {handleServerAppError} from "../utils/error-utils";

export enum TODOLISTS_ACTION_TYPE {
    REMOVE_TODOLIST = "REMOVE-TODOLIST",
    ADD_TODOLIST = "ADD-TODOLIST",
    CHANGE_TODOLIST_TITLE = "CHANGE-TODOLIST-TITLE",
    CHANGE_TODOLIST_FILTER = "CHANGE-TODOLIST-FILTER",
    SET_TODOLISTS = 'SET-TODOLISTS',
    CHANGE_TODOLISTS_ENTITY_STATUS = 'CHANGE-TODOLISTS-ENTITY-STATUS'
}

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case TODOLISTS_ACTION_TYPE.REMOVE_TODOLIST:
            return state.filter(todolist => todolist.id !== action.id);
        case TODOLISTS_ACTION_TYPE.ADD_TODOLIST:
            return [{...action.todolist, filter: 'all', entityStatus: "idle"}, ...state];
        case TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_TITLE:
            return state.map(todolist => todolist.id === action.id
                ? {...todolist, title: action.title}
                : todolist);
        case TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_FILTER:
            return state.map(todolist => todolist.id === action.id
                ? {...todolist, filter: action.filter}
                : todolist);
        case TODOLISTS_ACTION_TYPE.SET_TODOLISTS:
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        case TODOLISTS_ACTION_TYPE.CHANGE_TODOLISTS_ENTITY_STATUS:
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string)  => {
    return {type: TODOLISTS_ACTION_TYPE.REMOVE_TODOLIST, id: todolistId} as const
}

export const addTodolistAC = (todolist: TodolistType) => {
    return {type: TODOLISTS_ACTION_TYPE.ADD_TODOLIST, todolist} as const
}

export const changeTodolistTitleAC = (todolistId: string, newTitle: string) => {
    return {type: TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_TITLE, id: todolistId, title: newTitle} as const
}

export const changeTodolistFilterAC = (todolistId: string, newFilter: FilterValuesType) => {
    return {type: TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_FILTER, id: todolistId, filter: newFilter} as const
}

export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: TODOLISTS_ACTION_TYPE.SET_TODOLISTS, todolists} as const)

export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({type: TODOLISTS_ACTION_TYPE.CHANGE_TODOLISTS_ENTITY_STATUS, id, status} as const)


//THUNKS

type DispatchThunkType = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrroActionType>

export const fetchTodolistsTC = () => {
    return (dispatch: DispatchThunkType) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC("succeeded"))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: DispatchThunkType) => {
        dispatch(setAppStatusAC("loading"))
        dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC(todolistId))
            })
            .finally(() => dispatch(setAppStatusAC("succeeded")))
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: DispatchThunkType) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                    dispatch(setAppStatusAC("failed"))
                }
            })
            .catch( err => {
                if (err.data.resultCode === RequestStatusCodes.error) {
                    if (err.messages.length) {
                        dispatch(setAppErrorAC(err.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('Some error occurred'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
            .finally(()=> {
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: DispatchThunkType) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if (res.data.resultCode === RequestStatusCodes.success) {
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(setAppStatusAC("succeeded"))
                } else handleServerAppError(res.data, dispatch)
            })
    }
}



export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
