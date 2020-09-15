import React from 'react';
import {action} from '@storybook/addon-actions';
import {Task} from "./Task";

export default {
    title: 'Todolist/Task',
    component: Task,
};

const changeTaskStatusCallback = action("Status changed")
const changeTaskTitleCallback = action("Title changed")
const deleteTaskCallBack = action("Task deleted")

export const TaskBaseExapmle = (props: any) => {
    return (
        <>
            <Task task={{id: "1", isDone: true, title: "SCSS"}}
                  deleteTask={deleteTaskCallBack}
                  changeTaskTitle={changeTaskTitleCallback}
                  changeStatus={changeTaskStatusCallback}/>
            <Task task={{id: "1", isDone: false, title: "JS"}}
                  deleteTask={deleteTaskCallBack}
                  changeTaskTitle={changeTaskTitleCallback}
                  changeStatus={changeTaskStatusCallback}/>
        </>
    )
}
