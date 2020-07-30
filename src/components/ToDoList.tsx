import React, {useState} from "react";
import {FilterValuesType, TaskType} from "../App";
import {Button} from "../common/Button/Button";
import {CheckBox} from "../common/CheckBox/CheckBox";
import {Input} from "../common/Input/Input";
import {AddItemForm} from "./AddItemForm/AddItemForm";
import classes from "../common/CheckBox/CheckBox.module.scss";
import {EditableSpan} from "./EditableSpan/EditableSpan";

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
    changeTodolistTitle: (todolistId: string, newTodolistTitle: string)=>void
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
        function changeCheckBox(value: boolean): void {
            props.changeStatus(task.id, value, props.todolistId);
        }

        function deleteTask(): void {
            props.deleteTask(task.id, props.todolistId);
        }

        function changeTaskTitle(newTaskTitle: string) {
            props.changeTaskTitle(props.todolistId, task.id, newTaskTitle)
        }

        return (
            <li key={task.id} className={task.isDone ? 'task-default isDone' : 'task-default'}>
                <CheckBox checked={task.isDone}
                          disabled={false}
                          onClick={changeCheckBox}/>
                <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
                <Button disabled={false}
                        btnName={"x"}
                        btnType={"red"}
                        onClick={deleteTask}/>
            </li>
        )
    })

    return (
        <div className='todolist'>
            <div>
                <EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
                <Button onClick={props.deleteTodoList} disabled={false} btnName={"x"}/>
            </div>

            <div className='header'>
                <AddItemForm addItem={addTaskHandler}/>

                <div>
                    <Button onClick={onAllClickHandler}
                            btnName={"All"}
                            disabled={props.allTasks.length === 0}
                            btnActive={props.filter === "all"}/>
                    <Button onClick={onActiveClickHandler}
                            btnName={"Active"}
                            disabled={props.allTasks.filter(i => !i.isDone).length === 0}
                            btnActive={props.filter === "active"}/>
                    <Button onClick={onCompletedClickHandler}
                            btnName={"Completed"}
                            disabled={props.allTasks.filter(i => i.isDone).length === 0}
                            btnActive={props.filter === "completed"}/>
                </div>
            </div>

            <ul className="tasksList">
                {tasks}
            </ul>

        </div>
    )
}
