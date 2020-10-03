import React from 'react';
import {action} from '@storybook/addon-actions';
import {EditableSpan} from "./EditableSpan";
import {Meta} from "@storybook/react";

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
} as Meta;


export const EditableSpanFormBaseExample = (props: any) => {
    return (<EditableSpan value={"StartValue"} onChange={action("value changed")} />)
}
