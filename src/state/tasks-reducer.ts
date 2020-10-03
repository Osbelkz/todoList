import {AddTodolistActionType, RemoveTodolistActionType, TODOLISTS_ACTION_TYPE, SetTodolistsActionType} from "./todolists-reducer";
import {Dispatch} from "redux";
import {SetAppStatusActionType, SetAppErrroActionType, setAppStatusAC, setAppErrorAC} from "./app-reducer";
import {tasksAPI, TaskType, UpdateTaskModelType, TaskStatuses, TaskPriorities} from "../api/todolists-a-p-i";
import {handleServerAppError} from "../utils/error-utils";
import { AppRootStateType } from "./store";

export enum TASKS_ACTION_TYPE {
    ADD_TASK = "ADD_TASK",
    REMOVE_TASK = "REMOVE_TASK",
    UPDATE_TASK = 'UPDATE-TASK',
    SET_TASKS = 'SET-TASKS'
}

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case TASKS_ACTION_TYPE.REMOVE_TASK:
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)}
        case TASKS_ACTION_TYPE.ADD_TASK:
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case TASKS_ACTION_TYPE.UPDATE_TASK:
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case TODOLISTS_ACTION_TYPE.ADD_TODOLIST:
            return {...state, [action.todolist.id]: []}
        case TODOLISTS_ACTION_TYPE.REMOVE_TODOLIST:
            let newState = {...state}
            delete newState[action.id]
            return newState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state;
    }
}

//action creators

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: TASKS_ACTION_TYPE.REMOVE_TASK, taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: TASKS_ACTION_TYPE.ADD_TASK, task} as const
}
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: TASKS_ACTION_TYPE.UPDATE_TASK, model, todolistId, taskId} as const)

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: TASKS_ACTION_TYPE.SET_TASKS, tasks, todolistId} as const)


//additional functions

export type DispatchThunkType = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrroActionType>


export const fetchTasksTC = (todolistId: string) => (dispatch: DispatchThunkType) => {
    dispatch(setAppStatusAC("loading"))
    tasksAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: DispatchThunkType) => {
    dispatch(setAppStatusAC("loading"))
    tasksAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch(err => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC("failed"))
        })
}

export enum RequestStatusCodes {
    success = 0,
    error = 1,
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: DispatchThunkType) => {
    dispatch(setAppStatusAC('loading'))
    tasksAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === RequestStatusCodes.success) {
                const task = res.data.data.item
                dispatch(addTaskAC(task))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            dispatch(setAppErrorAC(err.message))
        })
        .finally(() => {
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: DispatchThunkType, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        dispatch(setAppStatusAC("loading"))
        tasksAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === RequestStatusCodes.success) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                    dispatch(setAppStatusAC("succeeded"))
                } else if (res.data.resultCode === RequestStatusCodes.error) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                    dispatch(setAppStatusAC("failed"))
                }
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
