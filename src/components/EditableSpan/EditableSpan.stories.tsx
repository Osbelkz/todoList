import React from 'react';
import {action} from '@storybook/addon-actions';
import {EditableSpan} from "./EditableSpan";
import {Meta} from "@storybook/react";

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
} as Meta;


const changeTitleCallback = action("Title changed")


export const EditableSpanBaseExapmle = (props: any) => {
    return (
        <>
            <EditableSpan title={"start value"} changeTitle={changeTitleCallback}/>
        </>
    )
}
