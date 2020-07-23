import React from 'react';
import { action } from '@storybook/addon-actions';
import {Button} from "./Button";

export default {
    title: 'Button',
    component: Button,
};

export const RegularButton = () => <Button btnName={"name"} disabled={false} onClick={action('clicked')}/>;
export const Disabled = () => <Button btnName={"name"} disabled={true} onClick={action('clicked')}/>;
export const RedButton = () => <Button btnName={"name"} btnType={"red"} disabled={false} onClick={action('clicked')}/>;
export const GreenButton = () => <Button btnName={"name"} btnType={"green"} disabled={false} onClick={action('clicked')}/>;
