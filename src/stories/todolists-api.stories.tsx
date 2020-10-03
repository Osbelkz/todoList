import React, {useEffect, useState} from 'react'
import {tasksAPI, todolistsAPI} from '../api/todolists-a-p-i'

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '1cdd9f77-c60e-4af5-b194-659e4ebd5d41'
    }
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsAPI.getTodolists()
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.createTodolist('blabla todolist')
            .then((res) => {
                debugger;
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '0da4eca9-b11b-416f-ac61-ecf3b195e25c'
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                debugger;
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '1490c9b5-19c9-44a8-bc18-5ca4f1597cfa'
        todolistsAPI.updateTodolist(todolistId, 'Dimych hello')
            .then((res) => {
                debugger;
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

