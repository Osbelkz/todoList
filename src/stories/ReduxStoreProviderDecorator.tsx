import {Provider} from "react-redux";
import {AppRootStateType, store} from "../state/store";
import React from "react";
import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../state/tasks-reducer";
import {todolistsReducer} from "../state/todolists-reducer";
import {v1} from "uuid";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
})

const initialGlobalState = {
    todolists: [
        {id: "todolist1", title: "what to learn", filter: "all"},
        {id: "todolist2", title: "what to buy", filter: "all"},
    ],
    tasks: {
        ["todolist1"]: [
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "JS", isDone: false},
        ],
        ["todolist2"]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React book", isDone: false},
        ],
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>;
}
