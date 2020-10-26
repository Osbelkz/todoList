import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {Dispatch} from "redux";
import {RequestStatusType, setAppErrorAC, setAppStatusAC,} from "./app-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/todolists-a-p-i";
import {handleServerAppError} from "../utils/error-utils";
import {AppRootStateType} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(tl => tl.id === action.payload.taskId)
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"})
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(tl => tl.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(task => ({...task, entityStatus: "idle"}))
        },
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
            const index = state[action.payload.todolistId].findIndex(tl => tl.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.status
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        })
    }
})

export const tasksReducer = slice.reducer

export const {
    changeTaskEntityStatusAC,
    addTaskAC,
    removeTaskAC,
    setTasksAC,
    updateTaskAC
} = slice.actions


export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    tasksAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC({todolistId, tasks: res.data.items}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "loading"}))
    tasksAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC({taskId, todolistId}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch(err => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status: "failed"}))
        })
}

export enum RequestStatusCodes {
    success = 0,
    error = 1,
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    tasksAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === RequestStatusCodes.success) {
                const task = res.data.data.item
                dispatch(addTaskAC({task}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            dispatch(setAppErrorAC(err.message))
        })
        .finally(() => {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "loading"}))
        tasksAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === RequestStatusCodes.success) {
                    dispatch(updateTaskAC({todolistId, taskId, model: domainModel}))
                    dispatch(setAppStatusAC({status: "succeeded"}))
                    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "succeeded"}))
                } else if (res.data.resultCode === RequestStatusCodes.error) {
                    dispatch(setAppErrorAC({error: res.data.messages[0]}))
                    dispatch(setAppStatusAC({status: "failed"}))
                    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "failed"}))
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

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}
