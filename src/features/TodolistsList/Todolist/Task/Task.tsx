import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskDomainType} from "../../tasks-reducer";
import { TaskStatuses } from "../../../../api/todolists-a-p-i";
import {tasksActions} from "../../index";
import { useActions } from "../../../../utils/redux-utils";

type TaskPropsType = {
    task: TaskDomainType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const {updateTask, removeTask} = useActions(tasksActions)

    const onClickHandler = useCallback(() => removeTask({taskId: props.task.id,todolistId: props.todolistId}), [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        updateTask({
            taskId: props.task.id,
            domain: {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New},
            todolistId: props.todolistId
        })}, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        updateTask({
            taskId: props.task.id,
            domain: {title: newValue},
            todolistId: props.todolistId
        })}, [props.task.id, props.todolistId]);

    return <div key={props.task.id}
                className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
                style={{position: "relative"}}
    >
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
            disabled={props.task.entityStatus === "loading"}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} entityStatus={props.task.entityStatus}/>
        <IconButton onClick={onClickHandler}
                    size={"small"}
                    disabled={props.task.entityStatus === "loading"}
                    style={{position: "absolute", top: "2px", right: "2px"}}
        >
            <Delete fontSize={"small"}/>
        </IconButton>
    </div>
})

