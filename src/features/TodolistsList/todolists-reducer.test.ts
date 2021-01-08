import {
    todolistsReducer,
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistDomainType,
    changeTodolistEntityStatusAC,
    fetchTodolistsTC,
    removeTodolistsTC,
    addTodolistsTC, changeTodolistTitleTC
} from './todolists-reducer';
import {v1} from 'uuid';
import {RequestStatusType} from "../app/app-reducer";

describe("todolist reducer test", () => {

    let todolistId1: string;
    let todolistId2: string;

    let startState: Array<TodolistDomainType> = [];

    beforeEach(() => {

        todolistId1 = v1();
        todolistId2 = v1();

        startState = [
            {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", entityStatus: "idle", order: 0},
            {id: todolistId2, title: "What to buy", filter: "all", addedDate: "", entityStatus: "idle", order: 0}
        ]
    })


    test('correct todolist should be removed', () => {

        const endState = todolistsReducer(
            startState,
            removeTodolistsTC.fulfilled({todolistId: todolistId1}, "requestId", {todolistId: todolistId1}))

        expect(endState.length).toBe(1);
        expect(endState[0].id).toBe(todolistId2);
    });

    test('correct todolist should be added', () => {

        const todolistId3 = v1()
        let newTodolist = {
            id: todolistId3,
            title: "New todolist",
            filter: "all",
            addedDate: "",
            entityStatus: "idle",
            order: 0
        };
        const endState = todolistsReducer(startState, addTodolistsTC.fulfilled({todolist: newTodolist}, "requestId", {title: "New todolist"}))

        expect(endState.length).toBe(3);
        expect(endState[0].title).toBe("New todolist");
        expect(endState[2].title).toBe("What to buy");
    });

    test('correct todolist should change its name', () => {

        let newTodolistTitle = "New Todolist";

        const action = changeTodolistTitleTC.fulfilled({todolistId:todolistId2,newTitle:newTodolistTitle}, "requestId", {title: newTodolistTitle, id: todolistId2})

        const endState = todolistsReducer(startState, action);

        expect(endState[0].title).toBe("What to learn");
        expect(endState[1].title).toBe(newTodolistTitle);
    });

    test('correct filter of todolist should be changed', () => {

        let newFilter: FilterValuesType = "completed";

        const action = changeTodolistFilterAC({todolistId: todolistId2, newFilter} )

        const endState = todolistsReducer(startState, action);

        expect(endState[0].filter).toBe("all");
        expect(endState[1].filter).toBe(newFilter);
    });
    test("todolists should be added", ()=> {
        const action = fetchTodolistsTC.fulfilled({todolists: startState}, "requestId")


        const endState = todolistsReducer([], action)

        expect(endState.length).toBe(2)

    });
    test("correct entity status of todolist should be changed", ()=>{
        let newStatus: RequestStatusType = "loading"

        const action = changeTodolistEntityStatusAC({id: todolistId2, status: newStatus})

        const endState = todolistsReducer(startState, action)

        expect(endState[0].entityStatus).toBe("idle")
        expect(endState[1].entityStatus).toBe(newStatus)
    })
})




