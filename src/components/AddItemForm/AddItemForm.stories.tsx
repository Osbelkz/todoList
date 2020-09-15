import React from 'react';
import { action } from '@storybook/addon-actions';
import {AddItemForm} from "./AddItemForm";

export default {
    title: 'Todolist/AddItemForm',
    component: AddItemForm,
};

const callback = action("Button 'add' was pressed inside the form")

export const AddItemFromBaseExapmle = (props: any) => {
    return <AddItemForm addItem={callback}/>
}
