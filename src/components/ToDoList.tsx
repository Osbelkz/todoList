import React, {useCallback} from "react";
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan/EditableSpan";
import {IconButton, Button} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, TaskType} from "../state/tasks-reducer";
import {ChangeTodolistFilterAC, ChangeTodolistTitleAC, RemoveTodolistAC, TodoListType} from "../state/todolists-reducer";
import {Task} from "./Task/Task";

type ToDoListPropsType = {
    todolist: TodoListType
}

export const ToDoList = React.memo((props: ToDoListPropsType) => {

    const tasksObj = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todolist.id]);
    const dispatch = useDispatch();

    let tasksForToDoList: Array<TaskType> = tasksObj;
    switch (props.todolist.filter) {
        case "active":
            tasksForToDoList = tasksForToDoList.filter(i => !i.isDone);
            break;
        case "completed":
            tasksForToDoList = tasksForToDoList.filter(i => i.isDone);
            break;
        case "all":
            break;
    }

    const addTaskHandler = useCallback((value: string): void => {
        dispatch(addTaskAC(props.todolist.id, value))
    }, [dispatch, props.todolist.id])

    const changeTodolistTitle = useCallback((newTitle: string): void => {
        dispatch(ChangeTodolistTitleAC(props.todolist.id, newTitle))
    }, [dispatch, props.todolist.id])

    const removeTodolistHandler = useCallback((): void => {
        dispatch(RemoveTodolistAC(props.todolist.id))
    }, [dispatch, props.todolist.id])

    const changeStatus = useCallback((taskId: string, newStatus: boolean): void => {
        dispatch(changeTaskStatusAC(taskId, newStatus, props.todolist.id ));
    }, [dispatch, props.todolist.id])

    const deleteTask = useCallback((taskId: string) => {
        dispatch(removeTaskAC(taskId, props.todolist.id));
    }, [dispatch, props.todolist.id])

    const changeTaskTitle = useCallback((taskId:string, newTaskTitle: string): void => {
        dispatch(changeTaskTitleAC(taskId, newTaskTitle, props.todolist.id))
    }, [dispatch, props.todolist.id])


    const onAllClickHandler = () => {
        dispatch(ChangeTodolistFilterAC(props.todolist.id, 'all'))
    }

    const onActiveClickHandler = () => {
        dispatch(ChangeTodolistFilterAC(props.todolist.id, 'active'))
    }

    const onCompletedClickHandler = () => {
        dispatch(ChangeTodolistFilterAC(props.todolist.id, 'completed'))
    }


    const tasks = tasksForToDoList.map(task => <Task
        key={task.id}
        task={task}
        changeStatus={changeStatus}
        changeTaskTitle={changeTaskTitle}
        deleteTask={deleteTask}
    />)

    return (
        <div className='todolist'>
            <div>
                <EditableSpan title={props.todolist.title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={removeTodolistHandler}>
                    <Delete/>
                </IconButton>
            </div>
            <div className='header'>
                <AddItemForm addItem={addTaskHandler}/>
                <div>
                    <Button onClick={onAllClickHandler}
                            disabled={tasksObj.length === 0}
                            color={"primary"}
                            variant={props.todolist.filter === "all" ? "contained" : "outlined"}>All</Button>
                    <Button onClick={onActiveClickHandler}
                            disabled={tasksObj.filter(i => !i.isDone).length === 0}
                            color={"primary"}
                            variant={props.todolist.filter === "active" ? "contained" : "outlined"}>Active</Button>
                    <Button onClick={onCompletedClickHandler}
                            disabled={tasksObj.filter(i => i.isDone).length === 0}
                            color={"primary"}
                            variant={props.todolist.filter === "completed" ? "contained" : "outlined"}>Completed</Button>
                </div>
            </div>
            <div className="tasksList">
                {tasks}
            </div>
        </div>
    )
})
