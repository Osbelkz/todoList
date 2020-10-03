import React from 'react';
import { action } from '@storybook/addon-actions';
import {AddItemForm} from "./AddItemForm";

export default {
    title: 'Todolist/AddItemForm',
    component: AddItemForm,
};

export const AddItemFormBaseExample = (props: any) => {
    return (<AddItemForm entityStatus={"idle"}
                         addItem={action('Button inside form clicked')}
    />)
}
