import {asyncActions as tasksAsyncActions} from "./tasks-reducer"
import {asyncActions as todolistAsyncActions} from "./todolists-reducer"
import {slice as todolistsSlice} from "./todolists-reducer"
import {slice as tasksSlice} from "./todolists-reducer"
import {TodolistsList} from "./TodolistsList"

const todolistsActions = {
    ...todolistAsyncActions,
    ...todolistsSlice.actions
}

const tasksActions = {
    ...tasksAsyncActions,
}

const todolistsReducer = todolistsSlice.reducer
const tasksReducer = tasksSlice.reducer

export {
    tasksActions,
    todolistsActions,
    TodolistsList,
    todolistsReducer,
    tasksReducer
}
