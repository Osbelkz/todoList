import {addTodolistAC, removeTodolistAC, todolistsReducer, TodoListType} from "./todolists-reducer";
import {tasksReducer, TasksListType} from "./tasks-reducer";

describe("common tasks and todolist reducer test", ()=>{
    test('new array should be added when new todolist is added', () => {
        const startState: TasksListType = {
            "todolistId1": [
                { id: "1", title: "CSS", isDone: false },
                { id: "2", title: "JS", isDone: true },
                { id: "3", title: "React", isDone: false }
            ],
            "todolistId2": [
                { id: "1", title: "bread", isDone: false },
                { id: "2", title: "milk", isDone: true },
                { id: "3", title: "tea", isDone: false }
            ],
        };

        const action = addTodolistAC("new todolist");

        const endState = tasksReducer(startState, action)


        const keys = Object.keys(endState);
        const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
        if (!newKey) {
            throw Error("new key should be added")
        }

        expect(keys.length).toBe(3);
        expect(endState[newKey]).toEqual([]);
    });

    test('property with todolistId should be deleted', () => {
        const startState: TasksListType = {
            "todolistId1": [
                { id: "1", title: "CSS", isDone: false },
                { id: "2", title: "JS", isDone: true },
                { id: "3", title: "React", isDone: false }
            ],
            "todolistId2": [
                { id: "1", title: "bread", isDone: false },
                { id: "2", title: "milk", isDone: true },
                { id: "3", title: "tea", isDone: false }
            ]
        };

        const action = removeTodolistAC("todolistId2");

        const endState = tasksReducer(startState, action)


        const keys = Object.keys(endState);

        expect(keys.length).toBe(1);
        expect(endState["todolistId2"]).not.toBeDefined();
    });

    test('ids should be equals', () => {
        const startTasksState: TasksListType = {};
        const startTodolistsState: Array<TodoListType> = [];

        const action = addTodolistAC("new todolist");

        const endTasksState = tasksReducer(startTasksState, action)
        const endTodolistsState = todolistsReducer(startTodolistsState, action)

        const keys = Object.keys(endTasksState);
        const idFromTasks = keys[0];
        const idFromTodolists = endTodolistsState[0].id;

        expect(idFromTasks).toBe(action.todolistId);
        expect(idFromTodolists).toBe(action.todolistId);
    });
})

