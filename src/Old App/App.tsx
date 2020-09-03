import React, {useState} from 'react';
import '../App.css';
import {ToDoList} from "../components/ToDoList";
import {v1} from "uuid";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';

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


function App() {

    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListId1, title: 'what to learn', filter: "completed"},
        {id: todoListId2, title: 'what to buy', filter: "active"}
    ])

    let [tasks, setTasks] = useState<TasksListType>({
            [todoListId1]: [
                {id: v1(), title: 'Javascript', isDone: false,},
                {id: v1(), title: 'HTML', isDone: true,},
                {id: v1(), title: 'CSS', isDone: false,},
                {id: v1(), title: 'React', isDone: false,},
                {id: v1(), title: 'Redux', isDone: false,},
            ],
            [todoListId2]: [
                {id: v1(), title: 'Картоха', isDone: false,},
                {id: v1(), title: 'Запорожец', isDone: true,},
            ]
        }
    );


    function deleteTask(taskId: string, todoListId: string): void {
        tasks[todoListId] = tasks[todoListId].filter(t => t.id !== taskId)
        setTasks({...tasks})
    }

    function changeFilter(newFilterValue: FilterValuesType, todoListId: string) {
        let todoList = todoLists.find(tl => tl.id === todoListId);
        if (todoList) {
            todoList.filter = newFilterValue;
        }
        setTasks({...tasks})
    }

    function addTask(newText: string, todoListId: string): void {
        let newTask = {id: v1(), title: newText, isDone: false};
        tasks[todoListId] = [...tasks[todoListId], newTask]
        setTasks({...tasks});
    }

    function changeStatus(taskId: string, isDone: boolean, todoListId: string): void {
        let task = tasks[todoListId].find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone;
            setTasks({...tasks})
        }
    }

    function deleteTodoList(todoListId: string) {
        let newTodoLists = todoLists.filter(tl => tl.id !== todoListId)
        setTodoLists(newTodoLists)
        delete tasks[todoListId]
    }


    function addTodolist(newTodolistTitle: string) {
        let newTodolistId = v1();
        setTodoLists([...todoLists, {id: newTodolistId, title: newTodolistTitle, filter: "all"}])
        setTasks({...tasks, [newTodolistId]: []})
    }

    function changeTaskTitle(todolistId: string, taskId: string, newTitle: string) {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(task => task.id === taskId ? {...task, title: newTitle} : task)
        })
    }

    function changeTodolistTitle(todolistId: string, newTodolistTitle: string) {
        setTodoLists(todoLists.map(tl => tl.id === todolistId ? {...tl, title: newTodolistTitle} : tl))
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
                        let tasksForToDoList: Array<TaskType>;
                        switch (tl.filter) {
                            case "active":
                                tasksForToDoList = (tasks[tl.id].filter(i => !i.isDone));
                                break;
                            case "completed":
                                tasksForToDoList = (tasks[tl.id].filter(i => i.isDone));
                                break;
                            case "all":
                                tasksForToDoList = tasks[tl.id];
                                break;
                        }


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

export default App;
