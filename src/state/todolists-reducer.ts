import {v1} from "uuid";

export enum TODOLISTS_ACTION_TYPE {
    REMOVE_TODOLIST = "REMOVE-TODOLIST",
    ADD_TODOLIST = "ADD-TODOLIST",
    CHANGE_TODOLIST_TITLE = "CHANGE-TODOLIST-TITLE",
    CHANGE_TODOLIST_FILTER = "CHANGE-TODOLIST-FILTER"
}

export type FilterValuesType = "all" | "active" | "completed";
export type TodoListType = {
    title: string
    id: string
    filter: FilterValuesType
}

export type RemoveTodolistActionType = {
    type: TODOLISTS_ACTION_TYPE.REMOVE_TODOLIST
    id: string
}
export type AddTodolistActionType = {
    type: TODOLISTS_ACTION_TYPE.ADD_TODOLIST
    title: string
    todolistId: string
}
export type ChangeTodolistTitleActionType = {
    type: TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_TITLE
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_FILTER
    id: string
    filter: FilterValuesType
}

type ActionsTypes = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

const initialState: Array<TodoListType> = []

export const todolistsReducer = (state = initialState, action: ActionsTypes): Array<TodoListType> => {
    switch (action.type) {
        case TODOLISTS_ACTION_TYPE.REMOVE_TODOLIST:
            return state.filter(todolist => todolist.id !== action.id);
        case TODOLISTS_ACTION_TYPE.ADD_TODOLIST:
            return [
                ...state,
                {id: action.todolistId, title: action.title, filter: "all"}
            ];
        case TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_TITLE:
            return state.map(todolist => todolist.id === action.id
                ? {...todolist, title: action.title}
                : todolist);
        case TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_FILTER:
            return state.map(todolist => todolist.id === action.id
                ? {...todolist, filter: action.filter}
                : todolist);
        default:
            return state;
    }
}

export const RemoveTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: TODOLISTS_ACTION_TYPE.REMOVE_TODOLIST, id: todolistId}
}

export const AddTodolistAC = (newTodolistTitle: string): AddTodolistActionType => {
    return {type: TODOLISTS_ACTION_TYPE.ADD_TODOLIST, title: newTodolistTitle, todolistId: v1()}
}

export const ChangeTodolistTitleAC = (todolistId: string, newTitle: string): ChangeTodolistTitleActionType => {
    return {type: TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_TITLE, id: todolistId, title: newTitle}
}

export const ChangeTodolistFilterAC = (todolistId: string, newFilter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: TODOLISTS_ACTION_TYPE.CHANGE_TODOLIST_FILTER, id: todolistId, filter: newFilter}
}
