import { Task } from "./Task/Task"
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan"
import { TaskStatuses } from "../../../api/todolists-a-p-i"
import {FilterValuesType, TodolistDomainType} from "../todolists-reducer"
import React, {useCallback, useEffect} from "react"
import {TaskDomainType} from "../tasks-reducer"
import {Delete} from "@material-ui/icons";
import {IconButton, Button, PropTypes, Paper} from "@material-ui/core";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../../components/AddItemForm/AddItemForm";
import {tasksActions, todolistsActions} from "../index";
import {useActions, useAppDispatch} from "../../../utils/redux-utils";


type TodolistPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskDomainType>
}

export const Todolist = React.memo(function (props: TodolistPropsType) {
    console.log('Todolist called')

    const {
        removeTodolist,
        changeTodolistTitle,
        changeTodolistFilter,
    } = useActions(todolistsActions)

    const {fetchTasks} = useActions(tasksActions)

    const dispatch = useAppDispatch()

    useEffect(() => {
        fetchTasks(props.todolist.id)
    }, [])


    const addTaskCallback = useCallback(async (params: {title: string}, helper: AddItemFormSubmitHelperType ) => {
        let thunk = tasksActions.addTask({title: params.title,todolistId: props.todolist.id})
        const resultAction = await dispatch(thunk)

        if (tasksActions.addTask.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const error = resultAction.payload?.errors[0]
                helper.setError(error)
            } else {
                helper.setError("Some error occured")
            }
        } else {
            helper.setTaskText("")
        }
    }, [props.todolist.id])

    const removeTodolistHandler = () => {
        removeTodolist({todolistId: props.todolist.id})
    }
    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitle({id: props.todolist.id, title})
    }, [props.todolist.id])

    const onFilterButtonClickHandler = useCallback(
        (filter: FilterValuesType) => changeTodolistFilter({
            newFilter:
            filter,
            todolistId: props.todolist.id
        }), [props.todolist.id])


    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const renderFilterButton = (
        buttonFilter: FilterValuesType,
        color: PropTypes.Color,
        text: string
    ) => {
        return <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                       onClick={() => onFilterButtonClickHandler(buttonFilter)}
                       color={color}>{text}
        </Button>
    }

    return <Paper style={{padding: '10px', position: "relative"}}>
            <IconButton onClick={removeTodolistHandler}
                        size={"small"}
                        disabled={props.todolist.entityStatus === "loading"}
                        style={{position: "absolute", right: "5px", top: "5px"}}
            >
                <Delete fontSize={"small"}/>
            </IconButton>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} entityStatus={props.todolist.entityStatus}/>
        </h3>
        <AddItemForm addItem={addTaskCallback} entityStatus={props.todolist.entityStatus}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}/>)
            }
            { !tasksForTodolist.length && <div style={{padding: "10px", color: "gray"}}>No tasks</div>}
        </div>
        <div style={{paddingTop: '10px'}}>
            {renderFilterButton('all', 'default', "All")}
            {renderFilterButton( 'active', 'primary', "Active")}
            {renderFilterButton( 'completed', 'secondary', "Completed")}
        </div>
    </Paper>
})
