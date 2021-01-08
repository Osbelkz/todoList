import React from 'react';
import {action} from '@storybook/addon-actions';
import {Task} from "./Task";
import { TaskStatuses, TaskPriorities } from '../../../../api/todolists-a-p-i';
import {ReduxStoreProviderDecorator} from "../../../../stories/ReduxStoreProviderDecorator";

export default {
    title: 'Todolist/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
};

const removeCallback = action('Remove Button inside Task clicked');
const changeStatusCallback = action('Status changed inside Task');
const changeTitleCallback = action('Title changed inside Task');

export const TaskBaseExample = (props: any) => {
    return (
        <div>
            <Task
                task={{id: '1', status: TaskStatuses.Completed, title: "CSS", todoListId: "todolistId1", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"}}
                todolistId={"todolistId1"}
            />
            <Task
                task={{id: '2', status: TaskStatuses.New, title: "JS", todoListId: "todolistId1", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: "idle"}}
                todolistId={"todolistId2"}
            />
        </div>)
}
