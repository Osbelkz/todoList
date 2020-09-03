import React, {useReducer} from 'react';
import '../App.css';
import {ToDoList} from "../components/ToDoList";
import {v1} from "uuid";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "../state/todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer
} from "../state/tasks-reducer";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean,
}

export type FilterValuesType = "all" | "active" | "completed";


export type TodoListType = {
    title: string
    id: string
    filter: FilterValuesType
}

export type TasksListType = {
    [key: string]: Array<TaskType>
}


function AppWithReducers() {

    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, dispatchToTodoLists] = useReducer(todolistsReducer, [
        {id: todoListId1, title: 'what to learn', filter: "completed"},
        {id: todoListId2, title: 'what to buy', filter: "active"}
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
            [todoListId1]: [
                {id: v1(), title: 'Javascript', isDone: false,},
                {id: v1(), title: 'HTML', isDone: true,},
                {id: v1(), title: 'CSS', isDone: false,},
                {id: v1(), title: 'React', isDone: false,},
                {id: v1(), title: 'Redux', isDone: false,},
            ],
            [todoListId2]: [
                {id: v1(), title: 'Сок', isDone: false,},
                {id: v1(), title: 'Запорожец', isDone: true,},
            ]
        }
    );


    function deleteTask(taskId: string, todoListId: string): void {
        dispatchToTasks(removeTaskAC(taskId, todoListId))
    }

    function changeFilter(newFilterValue: FilterValuesType, todoListId: string) {
        dispatchToTodoLists(ChangeTodolistFilterAC(todoListId, newFilterValue))
    }

    function addTask(newText: string, todoListId: string): void {
        dispatchToTasks(addTaskAC(todoListId, newText))
    }

    function changeTaskStatus(taskId: string, isDone: boolean, todoListId: string): void {
        dispatchToTasks(changeTaskStatusAC(taskId, isDone, todoListId))
    }

    function deleteTodoList(todoListId: string) {
        let action = RemoveTodolistAC(todoListId)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    function addTodolist(newTodolistTitle: string) {
        let action = AddTodolistAC(newTodolistTitle)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    function changeTaskTitle(todolistId: string, taskId: string, newTitle: string) {
        dispatchToTasks(changeTaskTitleAC(todolistId, taskId, newTitle))
    }

    function changeTodolistTitle(todolistId: string, newTodolistTitle: string) {
        dispatchToTodoLists(ChangeTodolistTitleAC(todolistId, newTodolistTitle))
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoLists.map(tl => {
                        // let tasksForToDoList: Array<TaskType>;
                        // switch (tl.filter) {
                        //     case "active":
                        //         tasksForToDoList = (tasks[tl.id].filter(i => !i.isDone));
                        //         break;
                        //     case "completed":
                        //         tasksForToDoList = (tasks[tl.id].filter(i => i.isDone));
                        //         break;
                        //     case "all":
                        //         tasksForToDoList = tasks[tl.id];
                        //         break;
                        // }


                        return (
                            <Grid item>
                                <Paper elevation={23} style={{padding: "10px"}}>
                                    <ToDoList
                                        key={tl.id}
                                        todolist={tl}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>

            </Container>
        </div>
    )
}

export default AppWithReducers;
