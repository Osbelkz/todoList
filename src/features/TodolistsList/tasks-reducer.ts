import {addTodolistsTC, fetchTodolistsTC, removeTodolistsTC} from "./todolists-reducer";
import {RequestStatusType, setAppErrorAC, setAppStatusAC,} from "../app/app-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/todolists-a-p-i";
import {handleServerAppError} from "../utils/error-utils";
import {AppRootStateType} from "../app/store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

export enum RequestStatusCodes {
    success = 0,
    error = 1,
}

export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await tasksAPI.getTasks(todolistId)
    thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
    return {todolistId, tasks: res.data.items}
})
export const removeTaskTC = createAsyncThunk("tasks/removeTask", async (params: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(changeTaskEntityStatusAC({
        todolistId: params.todolistId,
        taskId: params.taskId,
        status: "loading"
    }))
    try {
        const res = await tasksAPI.deleteTask(params.todolistId, params.taskId)
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {taskId: params.taskId, todolistId: params.todolistId}
    } catch (e) {
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}))
        return thunkAPI.rejectWithValue(setAppErrorAC(e.message))
    }
})
export const addTaskTC = createAsyncThunk("tasks/addTask", async (params: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await tasksAPI.createTask(params.todolistId, params.title)
        if (res.data.resultCode === RequestStatusCodes.success) {
            return res.data.data.item
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerAppError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }
})

export const updateTaskTC = createAsyncThunk("tasks/updateTask", async (params: { taskId: string, domain: UpdateDomainTaskModelType, todolistId: string }, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType
    const {taskId, todolistId, domain} = params
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        return rejectWithValue(null)
    }

    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domain
    }

    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "loading"}))
    const res = await tasksAPI.updateTask(todolistId, taskId, apiModel)
    try {
        if (res.data.resultCode === RequestStatusCodes.success) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "succeeded"}))
            return params
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "failed"}))
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerAppError(e, dispatch)
        return rejectWithValue(null)
    }

})


const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
            const index = state[action.payload.todolistId].findIndex(tl => tl.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.status
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistsTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistsTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(task => ({...task, entityStatus: "idle"}))
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId]
                .findIndex(tl => tl.id === action.payload.taskId)
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"})
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(tl => tl.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.domain}
        })
    }
})

export const tasksReducer = slice.reducer

export const {
    changeTaskEntityStatusAC,
} = slice.actions

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
