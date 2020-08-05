import React, {MouseEvent, ChangeEvent} from "react";
import {FilterValuesType, TaskType} from "../App";
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan/EditableSpan";
import {Checkbox, IconButton, Button} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

type ToDoListProps = {
    todolistId: string
    title: string
    filter: FilterValuesType
    allTasks: Array<TaskType>
    tasks: Array<TaskType>
    deleteTask: (taskId: string, todoListId: string) => void
    addTask: (newText: string, todoListId: string) => void
    changeFilter: (newFilterValue: FilterValuesType, todoListId: string) => void
    changeStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    deleteTodoList: () => void
    changeTaskTitle: (todolistId: string, taskId: string, newTaskTitle: string) => void
    changeTodolistTitle: (todolistId: string, newTodolistTitle: string) => void
}


export function ToDoList(props: ToDoListProps) {


    function addTaskHandler(value: string) {
        props.addTask(value, props.todolistId)
    }

    function changeTodolistTitle(newTitle: string) {
        props.changeTodolistTitle(props.todolistId, newTitle)
    }

    function onAllClickHandler() {
        props.changeFilter('all', props.todolistId)
    }

    function onActiveClickHandler() {
        props.changeFilter('active', props.todolistId)
    }

    function onCompletedClickHandler() {
        props.changeFilter('completed', props.todolistId)
    }


    const tasks = props.tasks.map(task => {
        function changeCheckBox(e: ChangeEvent<HTMLInputElement>): void {
            props.changeStatus(task.id, e.currentTarget.checked, props.todolistId);
        }

        function deleteTask(): void {
            props.deleteTask(task.id, props.todolistId);
        }

        function changeTaskTitle(newTaskTitle: string) {
            props.changeTaskTitle(props.todolistId, task.id, newTaskTitle)
        }

        return (
            <div key={task.id} className={task.isDone ? 'task-default isDone' : 'task-default'}>
                <Checkbox checked={task.isDone}
                          color={"primary"}
                          onChange={changeCheckBox}/>
                <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
                <IconButton onClick={deleteTask}>
                    <Delete/>
                </IconButton>
            </div>
        )
    })

    return (
        <div className='todolist'>
            <div>
                <EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={props.deleteTodoList}>
                    <Delete/>
                </IconButton>
            </div>

            <div className='header'>
                <AddItemForm addItem={addTaskHandler}/>

                <div>
                    <Button onClick={onAllClickHandler}
                            disabled={props.allTasks.length === 0}
                            color={"primary"}
                            variant={props.filter === "all" ? "contained" : "outlined"}>All</Button>
                    <Button onClick={onActiveClickHandler}
                            disabled={props.allTasks.filter(i => !i.isDone).length === 0}
                            color={"primary"}
                            variant={props.filter === "active" ? "contained" : "outlined"}>Active</Button>
                    <Button onClick={onCompletedClickHandler}
                            disabled={props.allTasks.filter(i => i.isDone).length === 0}
                            color={"primary"}
                            variant={props.filter === "completed" ? "contained" : "outlined"}>Completed</Button>
                </div>
            </div>

            <div className="tasksList">
                {tasks}
            </div>

        </div>
    )
}
