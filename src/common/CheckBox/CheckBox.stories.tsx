import React from 'react';
import { action } from '@storybook/addon-actions';
import {CheckBox} from "./CheckBox";

export default {
    title: 'CheckBox',
    component: CheckBox,
};

export const CheckBoxEnabled = () => <CheckBox onClick={action("clicked")} disabled={false} checked={true} label={"label"}/>
export const CheckBoxDisabled = () => <CheckBox onClick={action("clicked")} disabled={false} checked={false} label={"label"}/>
