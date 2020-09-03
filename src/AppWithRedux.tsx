import React, {useCallback} from 'react';
import './App.css';
import {ToDoList} from "./components/ToDoList";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {AppBar, IconButton, Typography, Button, Toolbar, Container, Grid, Paper} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {AddTodolistAC, TodoListType,} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";


function AppWithRedux() {

    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    const dispatch = useDispatch();

    const addTodolist = useCallback((newTodolistTitle: string) => {
        dispatch(AddTodolistAC(newTodolistTitle))
    }, [dispatch])

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

                        return (
                            <Grid item key={tl.id}>
                                <Paper elevation={23} style={{padding: "10px"}}>
                                    <ToDoList
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

export default AppWithRedux;
