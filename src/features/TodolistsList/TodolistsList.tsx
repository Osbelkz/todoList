import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Grid} from '@material-ui/core'
import {AppRootStateType} from '../../app/store'
import {
    TodolistDomainType,
} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import {AddItemForm, AddItemFormSubmitHelperType} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Redirect} from "react-router-dom";
import {selectIsLoggedIn} from "../Auth/selectors";
import {todolistsActions} from "./index";
import {useActions, useAppDispatch} from "../../utils/redux-utils";

export const TodolistsList: React.FC = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    const {fetchTodolists} = useActions(todolistsActions)

    const addTodolistCallback = useCallback(async (params: { title: string }, helper: AddItemFormSubmitHelperType) => {


        let thunk = todolistsActions.addTodolist({title: params.title})
        const resultAction = await dispatch(thunk)

        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const error = resultAction.payload?.errors[0]
                helper.setError(error)
            } else {
                helper.setError("Some error occured")
            }
        } else {
            helper.setTaskText("")
        }

    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            fetchTodolists()
        }

    }, [])


    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm entityStatus={"idle"} addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap: "nowrap", overflowX: "scroll"}}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <div style={{width: "300px"}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                            />
                        </div>
                    </Grid>
                })
            }
        </Grid>
    </>
}
