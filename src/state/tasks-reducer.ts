import {v1} from "uuid"
import {AddTodolistActionType, RemoveTodolistActionType, TODOLISTS_ACTION_TYPE} from "./todolists-reducer";

export enum TASKS_ACTION_TYPE {
    ADD_TASK ="ADD_TASK",
    REMOVE_TASK ="REMOVE_TASK",
    CHANGE_TASK_STATUS = "CHANGE_TASK_STATUS",
    CHANGE_TASK_TITLE = "CHANGE_TASK_TITLE"
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean,
}

export type TasksListType = {
    [key: string]: Array<TaskType>
}

export type RemoveActionType = {
    type: TASKS_ACTION_TYPE.REMOVE_TASK
    taskId: string
    todolistId: string
}
export type AddTaskActionType = {
    type: TASKS_ACTION_TYPE.ADD_TASK
    todolistId: string
    title: string
}
export type ChangeTaskStatusActionType = {
    type: TASKS_ACTION_TYPE.CHANGE_TASK_STATUS
    taskId: string
    todolistId: string
    isDone: boolean
}
export type ChangeTaskTitleActionType = {
    type: TASKS_ACTION_TYPE.CHANGE_TASK_TITLE
    taskId: string
    todolistId: string
    title: string
}


type ActionsTypes = RemoveActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

const initialState:TasksListType = {}

export const tasksReducer = (state = initialState, action: ActionsTypes): TasksListType => {
    switch (action.type) {
        case TASKS_ACTION_TYPE.REMOVE_TASK:
            let newTodolist = [...state[action.todolistId].filter(task => task.id !== action.taskId)]
            return {...state, [action.todolistId]: newTodolist}
        case TASKS_ACTION_TYPE.ADD_TASK:
            let newTask = {id: v1(), isDone: false, title: action.title}
            return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}
        case TASKS_ACTION_TYPE.CHANGE_TASK_STATUS:
            return {
                ...state,
                [action.todolistId]: changeTitleAndStatus(state[action.todolistId], action.taskId, action.isDone)
            }
        case TASKS_ACTION_TYPE.CHANGE_TASK_TITLE:
            return {
                ...state,
                [action.todolistId]: changeTitleAndStatus(state[action.todolistId], action.taskId, action.title)
            }
        case TODOLISTS_ACTION_TYPE.ADD_TODOLIST:
            return {
                ...state,
                [action.todolistId]: []
            }
        case TODOLISTS_ACTION_TYPE.REMOVE_TODOLIST:
            let newState = {...state}
            delete newState[action.id]
            return newState
        default:
            return state;
    }
}

//action creators

export const removeTaskAC = (taskId: string, todolistId: string): RemoveActionType => {
    return {type: TASKS_ACTION_TYPE.REMOVE_TASK, taskId, todolistId}
}
export const addTaskAC = (todolistId: string, title: string): AddTaskActionType => {
    return {type: TASKS_ACTION_TYPE.ADD_TASK, todolistId, title}
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string,): ChangeTaskStatusActionType => {
    return {type: TASKS_ACTION_TYPE.CHANGE_TASK_STATUS, taskId, todolistId, isDone}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string,): ChangeTaskTitleActionType => {
    return {type: TASKS_ACTION_TYPE.CHANGE_TASK_TITLE, taskId, todolistId, title}
}


//additional functions

const changeTitleAndStatus = (tasks: Array<TaskType>, taskId: string, proper: string | boolean): Array<TaskType> => {
    let propertyName = typeof proper === "string" ? "title" : "isDone"
    return tasks.map(task => {
        if (task.id !== taskId) {
            return task
        }
        return {...task, [propertyName]: proper}
    })
}
