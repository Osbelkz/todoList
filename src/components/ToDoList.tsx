import React, {useState} from "react";
import {FilterValuesType, TaskType} from "../App";
import {Button} from "../common/Button/Button";
import {CheckBox} from "../common/CheckBox/CheckBox";
import {Input} from "../common/Input/Input";

type ToDoListProps = {
    id: string
    title: string
    filter: FilterValuesType
    allTasks: Array<TaskType>
    tasks: Array<TaskType>
    deleteTask: (taskId: string, todoListId: string) => void
    addTask: (newText: string, todoListId: string) => void
    changeFilter: (newFilterValue: FilterValuesType, todoListId: string) => void
    changeStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    deleteTodoList: () => void
}


export function ToDoList(props: ToDoListProps) {

    let [newTaskText, setTaskText] = useState('');
    let [error, setError] = useState<string | null>(null);

    function onTaskNameChanged(value: string): void {
        setTaskText(value);
        setError(null);
    }

    function addTask(): void {
        if (newTaskText.trim()) {
            props.addTask(newTaskText.trim(), props.id);
            setTaskText('');
        }
        setError('Title is required!');
    }


    function onAllClickHandler() {
        props.changeFilter('all', props.id)
    }
    function onActiveClickHandler() {
        props.changeFilter('active', props.id)
    }
    function onCompletedClickHandler() {
        props.changeFilter('completed', props.id)
    }

    const tasks = props.tasks.map(task => {
        function changeCheckBox(value: boolean): void {
            props.changeStatus(task.id, value, props.id);
        }

        function deleteTask(): void {
            props.deleteTask(task.id, props.id);
        }

        return (
            <li key={task.id} className={task.isDone ? 'task-default isDone' : 'task-default'}>
                <CheckBox label={task.title}
                          checked={task.isDone}
                          disabled={false}
                          onClick={changeCheckBox}/>
                <Button disabled={false}
                        btnName={"x"}
                        onClick={deleteTask}/>
            </li>
        )
    })
    return (
        <div className='todolist'>
            <h3>{props.title} <Button onClick={props.deleteTodoList} disabled={false} btnName={"x"}/></h3>

            <div className='header'>
                <div>
                    <Input onChange={onTaskNameChanged}
                           value={newTaskText}
                           addData={addTask}
                           error={error ? true : false}/>
                    <Button onClick={addTask}
                            btnName={"+"}
                            btnType={"green"}
                            disabled={!newTaskText}/>
                    {error && <div className="error-message">{error}</div>}
                </div>
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
