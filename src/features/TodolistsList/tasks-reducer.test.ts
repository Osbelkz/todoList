import {tasksReducer, TasksStateType, removeTaskTC, addTaskTC, updateTaskTC} from './tasks-reducer';
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-a-p-i";
import {addTodolistsTC} from "./todolists-reducer";

describe("tasks reducer test", () => {


    let todolistId1: string;
    let todolistId2: string;
    let startState: TasksStateType = {};

    beforeEach(()=>{

        todolistId1=v1();
        todolistId2=v1();

        startState = {
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
    })

    test('correct task should be deleted from correct array', () => {

        const payload = {taskId: "2", todolistId: todolistId2};
        const action = removeTaskTC.fulfilled(payload, "requestId", payload);

        const endState = tasksReducer(startState, action)

        expect(endState[todolistId1].length).toBe(3);
        expect(endState[todolistId2].length).toBe(2);
        expect(endState[todolistId2].every(t => t.id !== "2")).toBeTruthy();
    });

    test('correct task should be added to correct array', () => {

        const task = {
            todoListId: todolistId2,
            title: "juice",
            status: TaskStatuses.New,
            addedDate: "",
            deadline: "",
            description: "",
            order: 0,
            priority: 0,
            startDate: "",
            id: "id exists"
        }

        const action = addTaskTC.fulfilled(task, "requestId", {title: task.title, todolistId: todolistId2});
        const endState = tasksReducer(startState, action)

        expect(endState[todolistId1].length).toBe(3);
        expect(endState[todolistId2].length).toBe(4);
        expect(endState[todolistId2][0].id).toBeDefined();
        expect(endState[todolistId2][0].title).toBe("juice");
        expect(endState[todolistId2][0].status).toBe(TaskStatuses.New);
    })

    test('status of specified task should be changed', () => {

        const updateModel = {todolistId: todolistId2, taskId: "2", domain: {status: TaskStatuses.New}}

        const action = updateTaskTC.fulfilled(updateModel, "requestId", updateModel);

        const endState = tasksReducer(startState, action)

        expect(endState[todolistId2][1].status).toBe(TaskStatuses.New);
        expect(endState[todolistId1][1].status).toBe(TaskStatuses.Completed);
    });

    test('title of specified task should be changed', () => {

        const updateModel = {todolistId: todolistId2, taskId: "2", domain: {title: "juice"}}

        const action = updateTaskTC.fulfilled(updateModel, "requestId", updateModel);

        const endState = tasksReducer(startState, action)

        expect(endState[todolistId2][1].title).toBe("juice");
        expect(endState[todolistId1][1].title).toBe("JS");
    });
    test("new array should be added when new todolist is added", () => {
        const todolist = {
            id: "tl",
            title: "new tl",
            order: 0,
            addedDate: ""
        };
        const action = addTodolistsTC.fulfilled({todolist}, "requestId", {title: todolist.title})

        const endState = tasksReducer(startState, action)

        const keys = Object.keys(endState)
        const newKey = keys.find(k => k !== todolistId1 && k !==todolistId2)
    })
})


