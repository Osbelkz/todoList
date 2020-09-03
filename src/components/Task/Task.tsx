import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import { TaskType } from "../../state/tasks-reducer";

type PropsType = {
    task: TaskType
    deleteTask: (taskId: string) => void
    changeTaskTitle: (taskId: string, newTaskTitle: string) => void
    changeStatus: (taskId: string, newStatus: boolean) => void
}

export const Task = React.memo(function (props: PropsType){

    const changeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        props.changeStatus(props.task.id, e.currentTarget.checked);
    }, [props])

    const deleteTaskHandler = useCallback(() => {
        props.deleteTask(props.task.id);
    }, [props])

    const changeTaskTitleHandler = useCallback((newTaskTitle: string) => {
        props.changeTaskTitle(props.task.id, newTaskTitle)
    }, [props])

    return (
        <div key={props.task.id} className={props.task.isDone ? 'task-default isDone' : 'task-default'}>
            <Checkbox checked={props.task.isDone}
                      color={"primary"}
                      onChange={changeStatusHandler}/>
            <EditableSpan title={props.task.title} changeTitle={changeTaskTitleHandler}/>
            <IconButton onClick={deleteTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    )
})
