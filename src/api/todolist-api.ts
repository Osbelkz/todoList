import axios from "axios";


type TodolistType = {
    id: string,
    title: string
    addedDate: string,
    order: number
}

type CommonResponseType<T = {}> = {
    resultCode: number,
    messages: Array<string>,
    data: T
}

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "api-key": "2dece0c4-7aed-430e-aeba-9f10430f969a"
    }
})

export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>("todo-lists")
    },
    createTodolist(title: string) {
        return instance.post<CommonResponseType<{ item: TodolistType }>>("todo-lists", {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolistTitle(todolistId: string, title: string) {
        return instance.put<CommonResponseType>(`todo-lists/${todolistId}`, {title: title},)
    },
}
