import {addTodolistsTC, removeTodolistsTC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {tasksReducer, TasksStateType} from "./tasks-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-a-p-i";

describe("common tasks and todolist reducer test", ()=>{

    let todolistId1 = v1();
    let todolistId2 = v1();
    let tasksState: TasksStateType = {};

    let todolistsState: Array<TodolistDomainType> = [];


    beforeEach(()=>{
        tasksState = {
            [todolistId1]: [
                {id: "1", title: "CSS", status: TaskStatuses.New, todoListId: todolistId1,
                    description:"", startDate: "", deadline: "", addedDate: "",
                    order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
                {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: todolistId1,
                    description:"", startDate: "", deadline: "", addedDate: "",
                    order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
                {id: "3", title: "React", status: TaskStatuses.New, todoListId: todolistId1,
                    description:"", startDate: "", deadline: "", addedDate: "",
                    order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
            ],
            [todolistId2]: [
                {id: "1", title: "bread", status: TaskStatuses.New, todoListId: todolistId1,
                    description:"", startDate: "", deadline: "", addedDate: "",
                    order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
                {id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: todolistId1,
                    description:"", startDate: "", deadline: "", addedDate: "",
                    order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
                {id: "3", title: "tea", status: TaskStatuses.New, todoListId: todolistId1,
                    description:"", startDate: "", deadline: "", addedDate: "",
                    order: 0, priority: TaskPriorities.Low, entityStatus: "idle"},
            ]
        };

        todolistsState = [
            {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", entityStatus: "idle", order: 0},
            {id: todolistId2, title: "What to buy", filter: "all", addedDate: "", entityStatus: "idle", order: 0}
        ]
    })

    test('new array should be added when new todolist is added', () => {

        const todolistId3 = v1()
        let newTodolist = {
            id: todolistId3,
            title: "New todolist",
            filter: "all",
            addedDate: "",
            entityStatus: "idle",
            order: 0
        };

        const action = addTodolistsTC.fulfilled({todolist: newTodolist}, "reqiestId", {title: newTodolist.title});

        const endState = tasksReducer(tasksState, action)


        const keys = Object.keys(endState);
        const newKey = keys.find(k => k  === todolistId3);
        if (!newKey) {
            throw Error("new key should be added")
        }

        expect(keys.length).toBe(3);
        expect(endState[newKey]).toEqual([]);
    });

    test('property with todolistId should be deleted', () => {


        const action = removeTodolistsTC.fulfilled({todolistId: todolistId2}, "requestId", {todolistId: todolistId2});

        const endState = tasksReducer(tasksState, action)


        const keys = Object.keys(endState);

        expect(keys.length).toBe(1);
        expect(endState["todolistId2"]).not.toBeDefined();
    });

    test('ids should be equals', () => {
        const todolistId3 = v1()
        let newTodolist = {
            id: todolistId3,
            title: "New todolist",
            filter: "all",
            addedDate: "",
            entityStatus: "idle",
            order: 0
        };
        const action = addTodolistsTC.fulfilled({todolist: newTodolist}, "reqiestId", {title: newTodolist.title});

        const endTasksState = tasksReducer(tasksState, action)
        const endTodolistsState = todolistsReducer(todolistsState, action)

        const keys = Object.keys(endTasksState);
        const idFromTodolists = endTodolistsState[0].id;

        expect(keys.includes(action.payload.todolist.id)).toBeTruthy();
        expect(idFromTodolists).toBe(action.payload.todolist.id);
    });
})

