import React, {useEffect} from 'react';
import './App.css';
import {AppBar, IconButton, Typography, Button, Toolbar, Container, LinearProgress, CircularProgress} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {RequestStatusType, authMeTC} from './state/app-reducer';
import {ErrorSnackbar} from './components/ErrorSnackbar/ErrorSnackbar';
import {TodolistsList} from './components/TodolistsList';
import {Route, Switch} from 'react-router-dom';
import {Login} from "./features/Login/Login";
import {logoutTC} from "./state/auth-reducer";


function App() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const initApp = useSelector<AppRootStateType, boolean>(state => state.app.init)


    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    useEffect(() => {
        dispatch(authMeTC())
    })

    if (!initApp) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
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
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress color="secondary"/>}
            <Container fixed>

                <Switch>
                    <Route exact path={"/"} component={TodolistsList}/>
                    <Route path={"/login"} component={Login}/>
                </Switch>

            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default App;
