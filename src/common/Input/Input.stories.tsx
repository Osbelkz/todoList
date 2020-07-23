import React from 'react';
import { action } from '@storybook/addon-actions';
import {Input} from "./Input";

export default {
    title: 'Input',
    component: Input,
};

export const DefaultInput = () => <Input onChange={action("changed")} disabled={false} value={"text"}/>
export const DisabledInput = () => <Input onChange={action("changed")} disabled={true} value={"text"}/>
export const ErrorInput = () => <Input onChange={action("changed")} disabled={false} value={"text"} error={true}/>
export const PlaceHolderInput = () => <Input onChange={action("changed")} placeHolder={"ssss"} disabled={false} value={""} error={true}/>
