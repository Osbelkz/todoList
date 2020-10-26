import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers, createStore} from 'redux'
import { tasksReducer } from '../state/tasks-reducer';
import {appReducer} from "../state/app-reducer";
import {AppRootStateType} from "../state/store";
import {TaskPriorities, TaskStatuses} from "../api/todolists-a-p-i";
import {todolistsReducer} from "../state/todolists-reducer";
import {v1} from "uuid";
import {authReducer} from "../state/auth-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: "idle"},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: "idle"}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
            {id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"}
        ]
    },
    app: {
        status: "idle",
        error: null,
        init: false
    },
    auth: {
        isLoggedIn: false
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)
